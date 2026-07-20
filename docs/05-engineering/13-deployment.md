# 13 — Deployment

### Buyue (بيوع) — Vercel Hosting & Release Process

> **Purpose:** How the site gets from a commit to the live web. Covers the
> one-time Vercel import, environment variables, custom domain, rollback, and
> the production limitations that are still open (audit C-02, C-08, C-09).
>
> **Inheritance:** The quality bar this pipeline enforces is defined in
> [Doc 07 — Development Rules](07-development-rules.md); the phase gating is in
> [Doc 11 — Build Workflow](11-build-workflow.md). This document does not
> restate them, it describes the mechanics of shipping.

---

## 1. How deployment works

```
  git push origin main
          │
          ├──────────────► GitHub Actions CI ── quality gate, does NOT deploy
          │                 typecheck · lint · stylelint · format · build
          │
          └──────────────► Vercel Git integration ── builds and deploys
                            main         → Production
                            pull request → Preview (unique URL per PR)
```

Two independent systems watch the same repository.

**GitHub Actions** (`.github/workflows/ci.yml`) is a gate, not a deployer. It
holds no Vercel credentials and cannot deploy. Its job is to fail *before*
Vercel builds. It runs on Linux, which matters more than it sounds: the CI
runner's filesystem is case-sensitive while Windows is not, so an import
written as `@/components/ui/button` when the file is `Button.tsx` passes
locally and fails in CI — exactly where you want to find it.

**Vercel** deploys on its own, triggered by the Git integration. There is no
`vercel` CLI step, no `VERCEL_TOKEN`, no deploy action, and no secrets in the
repository. This mirrors the sibling `nobel-frontend` project.

A consequence worth internalising: **CI failing does not block the Vercel
deploy.** They run in parallel, not in sequence. If you want a red CI run to
prevent a production deploy, enable branch protection on `main` requiring the
`verify` check, so failing code cannot merge in the first place.

---

## 2. Files that configure the deploy

| File | Role |
|------|------|
| `vercel.json` | Framework preset, build command, install command |
| `.nvmrc` | Pins Node to 20 for **both** Vercel and GitHub Actions |
| `.vercelignore` | Keeps `docs/` and `brand-assets/` out of the deployment source |
| `.github/workflows/ci.yml` | The quality gate |
| `next.config.mjs` | Security headers and image formats — applied by Next, not Vercel |

### `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "next build",
  "installCommand": "npm ci"
}
```

`npm ci` rather than `npm install` is deliberate: it installs strictly from
`package-lock.json` and fails loudly if the lockfile has drifted from
`package.json`, instead of silently resolving different versions than the ones
tested locally. **Always commit the lockfile.**

There is intentionally **no `headers` block.** Security headers are already
defined in `next.config.mjs` (`X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `X-DNS-Prefetch-Control`, `Permissions-Policy`) and Next
applies them on Vercel. Duplicating them here would create two sources of
truth that drift.

### `.nvmrc`

Contains `20`. Both `actions/setup-node` (via `node-version-file`) and Vercel
read this file, so the Node version is declared once. It satisfies the
`engines: { node: ">=20.11.0" }` constraint in `package.json`.

> Note: local development is currently on Node 24. That is fine — 24 satisfies
> the `engines` floor — but CI and production build on 20, so 20 is the version
> that matters for release.

### `.vercelignore`

Excludes `docs/` (~11 MB of client PDFs), `brand-assets/` (30 unprocessed logo
originals), `data/`, `.github/` and `lighthouserc.json`. Nothing under those
paths is imported by `src/`, so excluding them only shrinks the upload.

**Do not add `public/` here** — that is the directory the browser actually
loads from.

---

## 3. One-time Vercel setup

1. Sign in to [vercel.com](https://vercel.com) **with the GitHub account** that
   can see `nobel-business/BUYUE`.
2. **Add New… → Project**.
3. Find `BUYUE` in the repository list and click **Import**. If it is not
   listed, use *Adjust GitHub App Permissions* to grant Vercel access to the
   `nobel-business` organisation.
4. Vercel reads `vercel.json` and pre-fills everything:
   - Framework Preset — **Next.js**
   - Build Command — `next build`
   - Install Command — `npm ci`
   - Node version — **20**, from `.nvmrc`
   - Root Directory — leave as `./`
5. **Environment Variables** — none are required for the first deploy
   (see §4 for why).
6. Click **Deploy**. First build takes roughly 2–4 minutes.

From then on every push to `main` deploys to production automatically, and
every pull request gets its own preview URL.

---

## 4. Environment variables

| Variable | Required | Where | Purpose |
|----------|----------|-------|---------|
| `NEXT_PUBLIC_SITE_URL` | No — see below | Vercel → Settings → Environment Variables | Canonical/hreflang/sitemap/OG base URL |
| `CONTACT_FORM_ENDPOINT` | Not yet wired | — | Contact form destination (C-09) |
| `NEXT_PUBLIC_ANALYTICS_ID` | Not yet wired | — | Analytics (H-10), consent-gated |
| `ADMIN_API_URL` / `ADMIN_API_TOKEN` | Not yet wired | — | Real admin backend (C-02) |

### Why the site URL is safe to leave unset

`siteUrl()` in `src/lib/config/seo.ts` resolves in three steps:

1. `NEXT_PUBLIC_SITE_URL`, if set — use it.
2. Otherwise `VERCEL_PROJECT_PRODUCTION_URL`, which Vercel injects
   automatically at build time.
3. Otherwise `http://localhost:3000`, for local development.

Step 2 is the safety net. Without it, deploying with no environment variables
configured would publish `http://localhost:3000` into every canonical tag,
every `hreflang` alternate, every `sitemap.xml` entry, the OG URL and the
Organization JSON-LD — and search engines would index those. This is verified:
a build with only `VERCEL_PROJECT_PRODUCTION_URL` set emits
`https://<project>.vercel.app/ar` throughout, with zero localhost references
in the output.

Because `VERCEL_PROJECT_PRODUCTION_URL` always points at the *production* host,
preview deploys emit production canonicals rather than advertising their own
preview URLs to crawlers — which is the correct SEO behaviour.

### When the real domain is confirmed (C-08)

Set `NEXT_PUBLIC_SITE_URL` to the full origin, no trailing slash:

```
NEXT_PUBLIC_SITE_URL = https://buyue.com
```

> ⚠ **`NEXT_PUBLIC_*` values are baked in at build time, not read at runtime.**
> Changing the variable has no effect until you redeploy. Vercel →
> Deployments → ⋯ → **Redeploy**.

---

## 5. What does *not* work in production yet

Deploying does not make the unfinished parts finished. These are open audit
items, carried here so they are not discovered by a client instead.

### 5.1 Contact form silently discards every submission (C-09) — 🔴

`src/app/api/contact/route.ts` validates the payload and returns
`{ ok: true }`. There is no email send, no CRM call, no database write, no log.
The UI shows a success state regardless, so a visitor believes their enquiry
was received.

**A live contact form that loses 100% of leads is worse than no form.** Before
any public launch, either wire a destination (Resend, Formspree, a CRM webhook)
or disable the form and show contact details only.

Related: `ContactForm.tsx` never sends the `website` honeypot field that the
server checks, so server-side spam protection is currently inert. There is
also no rate limiting.

### 5.2 The admin panel cannot work on Vercel (C-02) — 🔴

`src/lib/data/adminStore.ts` reads and writes
`process.cwd()/data/admin-store.json`. Vercel's serverless filesystem is
**read-only** outside `/tmp`, so:

- `getStore()` catches its own error and returns seed data — reads appear to
  work but always show seeds.
- `saveStore()` throws `EROFS`; the route returns a 500. Writes never persist.

The admin *page* (`/[locale]/admin`) already returns 404 in production via a
`NODE_ENV` guard, so there is no usable UI. The store's own header comment
states this plainly: *"NOT PRODUCTION: no auth, no database, and fs writes
don't work on serverless hosting."*

Note also that admin edits were never wired to the public logo walls — those
read `src/lib/data/clientLogos.ts` directly, not the store.

### 5.3 The admin API routes are publicly reachable — 🟠

**Decision taken: shipping as-is for this deploy.** The four handlers under
`/api/admin/*` have no authentication guard, unlike the admin page. Recorded
here so the risk is explicit and revisitable.

The practical exposure is limited by §5.2: because the filesystem is read-only,
`POST` and `DELETE` **fail closed with a 500** rather than succeeding. No
attacker can persist a defacement. What remains reachable is:

- `GET /api/admin` — discloses the seeded logo list and testimonials, all of
  which already appear on the public Clients page. No secrets.
- `POST`/`DELETE` — return 500s; a cheap way to generate error noise and
  consume function invocations.

**This changes the moment a real database replaces the fs store.** At that
point unauthenticated writes stop failing and start persisting. Add
authentication *before* wiring the C-02 backend, not after.

The minimal fix, whenever you want it, is the same guard the page already uses:

```ts
if (process.env.NODE_ENV !== 'development') {
  return NextResponse.json({ ok: false }, { status: 404 });
}
```

### 5.4 Brand fonts are not licensed (C-11) — 🟡

`public/fonts/` is empty and `src/lib/utils/fonts.ts` is commented out. The
site ships on fallback stacks (Noto Naskh Arabic / Inter), neither of which is
self-hosted. Typography will not match the brand guidelines until the 29LT
Zarid and Articulat V3 web licences are confirmed.

### 5.5 No Content-Security-Policy

Deliberately deferred in `next.config.mjs` until the analytics vendor, font
hosting and admin backend are chosen. Note that the layout injects two inline
`<script>` blocks (theme boot, Organization JSON-LD), so any future CSP will
need a nonce or hash for them.

### 5.6 English content is provisional (C-10)

`src/messages/en.json` carries `_note` keys marking the English as
*"PROVISIONAL — pending client translation approval. Not final."* The Arabic is
approved and verbatim; the English is not. Treat `/en` as a preview.

---

## 6. Custom domain

Once C-08 confirms the domain:

1. Vercel → Project → **Settings → Domains → Add**.
2. Enter the apex domain (e.g. `buyue.com`). Vercel will also offer `www`.
3. At the DNS registrar:

   | Record | Name | Value |
   |--------|------|-------|
   | `A` | `@` | `76.76.21.21` |
   | `CNAME` | `www` | `cname.vercel-dns.com` |

4. Choose the redirect direction (`www` → apex, or apex → `www`) in Vercel's
   Domains panel. Pick one and keep it — both resolving independently splits
   SEO signals.
5. Set `NEXT_PUBLIC_SITE_URL` to the chosen canonical origin and **redeploy**
   (see §4).
6. Verify afterwards: `curl -s https://<domain>/sitemap.xml | head`, and
   confirm `<loc>` entries use the real domain, not `*.vercel.app`.

DNS propagation is usually minutes; allow up to 24 hours. Vercel issues and
renews the TLS certificate automatically.

---

## 7. Rollback

Vercel keeps every previous build immutable.

1. Vercel → **Deployments**.
2. Pick the last known-good deployment.
3. **⋯ → Promote to Production**.

This is near-instant — it repoints the alias, it does not rebuild. Use it
first, then fix forward in Git; do not debug on production.

---

## 8. Pre-launch checklist

Environment and config:

- [ ] `NEXT_PUBLIC_SITE_URL` set to the confirmed domain, and redeployed
- [ ] Custom domain added, DNS verified, redirect direction chosen
- [ ] `sitemap.xml` and `robots.txt` show the real domain
- [ ] Branch protection on `main` requiring the CI `verify` check

Blocking content/product items:

- [ ] Contact form has a real destination, or is disabled (§5.1)
- [ ] Admin API authenticated, or routes blocked in production (§5.3)
- [ ] Arabic content verified character-by-character against the client's
      original file (Doc 02 `⚠ VERIFY` strings)
- [ ] English translation approved by the client (C-10), or `/en` excluded from
      the sitemap and `noindex`ed
- [ ] Brand fonts licensed and installed (C-11)
- [ ] Contact facts confirmed — `info@beuyue.com` vs the brand file's domain,
      and the second Khobar phone number (C-08)
- [ ] Privacy Policy published and PDPL consent wired into the form (C-09)

Quality:

- [ ] `npm run verify` passes
- [ ] Lighthouse meets `lighthouserc.json` thresholds — performance ≥ 0.9,
      accessibility ≥ 0.95, SEO ≥ 0.9, LCP ≤ 2.5 s, CLS ≤ 0.1
- [ ] Both locales checked on a real device, including RTL layout
- [ ] `prefers-reduced-motion` verified — the preloader must be skipped

---

## 9. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `npm ci` fails on Vercel but works locally | `package-lock.json` out of sync with `package.json` | Run `npm install` locally, commit the lockfile |
| Build fails on Vercel/CI, passes on Windows | Linux is case-sensitive; import casing does not match the filename | Match the file's exact case. CI catches this before Vercel |
| Canonical/sitemap show `*.vercel.app` after adding a domain | `NEXT_PUBLIC_SITE_URL` unset, or set but not rebuilt | Set it, then **Redeploy** — the value is baked in at build time |
| Canonical/sitemap show `localhost:3000` | Neither `NEXT_PUBLIC_SITE_URL` nor `VERCEL_PROJECT_PRODUCTION_URL` resolved | Should be impossible on Vercel; check `siteUrl()` in `src/lib/config/seo.ts` |
| `/api/admin/*` returns 500 | Read-only serverless filesystem — expected (§5.2) | Not a bug. Requires the C-02 backend |
| Contact form "succeeds" but no email arrives | No destination is wired (§5.1) | Implement `api/contact/route.ts` |
| `/[locale]/admin` or `/design-system` 404s in production | Intentional `NODE_ENV` guard | Run locally with `npm run dev` |
| Fonts look wrong | Brand webfonts absent (C-11) | Expected until licensing is confirmed |
| Theme flashes on load | Boot script blocked or failed | Check the inline script in `src/app/[locale]/layout.tsx` |

---

## 10. Day-to-day release flow

```bash
git checkout -b feat/my-change
# …work…
npm run verify          # same gates CI runs
git commit && git push
# open a PR → CI runs, Vercel posts a preview URL on the PR
# review the preview in BOTH locales, then merge to main → production
```

Never commit directly to `main` — it deploys straight to production.
