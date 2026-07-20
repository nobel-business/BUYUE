# Buyue (بيوع) — Website

Premium, bilingual (**Arabic-first / English-second**) marketing website for
**بيوع | Buyue**, an integrated marketing & branding agency (operating brand of
Noble Business Group).

> **Single source of truth:** the [`docs/`](./docs) package (Docs 01–12, grouped by
> discipline — start at [`docs/README.md`](./docs/README.md)). No implementation decision
> may contradict it. Arabic content is **final and verbatim** (Doc 02) — never rewrite,
> translate, or invent it.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict)
- **next-intl** — locale routing (`/ar` default, `/en`), `dir`/`lang`, message catalogues
- **CSS Modules + CSS custom-property design tokens** (logical properties → native RTL)
- **motion** (Framer Motion successor) — component motion (Phase 2+)

## Scripts

| Command                           | Purpose                                  |
| --------------------------------- | ---------------------------------------- |
| `npm run dev`                     | Start dev server                         |
| `npm run build`                   | Production build                         |
| `npm run typecheck`               | `tsc --noEmit`                           |
| `npm run lint` / `lint:styles`    | ESLint / Stylelint                       |
| `npm run format` / `format:check` | Prettier                                 |
| `npm run verify`                  | typecheck + lint + styles + format check |

## Project structure

```
src/
  app/[locale]/     App Router (locale-segmented): layout, pages, not-found
  app/api/          route handlers (contact, admin scaffold)
  i18n/             routing + per-request message config
  messages/         ar.json / en.json  (verbatim content, added per phase)
  styles/           reset · tokens (brand colors) · globals
  lib/              config · data · motion · utils
  components/       ui · layout · forms · overlay · navigation · sections
public/
  fonts/            drop licensed 29LT Zarid + Articulat V3 here (see README)
  brand/ logos/     web-optimised assets served to the browser
docs/               the specification package (Docs 01–12) + source PDFs
brand-assets/       original identity marks + unprocessed client logo files
```

> `docs/` and `brand-assets/` hold **source** material and are never served.
> Anything the browser loads lives in `public/`.

## Build status (per Doc 11 — Build Workflow)

| Phase                        | Status                                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| **1 — Project Setup**        | ✅ Approved                                                                                     |
| **2 — Global Design System** | ✅ Approved                                                                                     |
| **3 — Navigation**           | ✅ Approved                                                                                     |
| **4 — Hero**                 | ✅ Approved                                                                                     |
| **5 — About**                | ✅ Approved                                                                                     |
| **6 — Services**             | ✅ Approved                                                                                     |
| **7 — Clients**              | ✅ Approved                                                                                     |
| **8 — Contact**              | ✅ Approved                                                                                     |
| **9 — Admin**                | 🟡 Interim dev scaffold (logos + testimonials, local store); production backend blocked on C-02 |
| **10 — Assembly**            | 🔄 In progress — Home teasers + SEO done; legal/404/analytics remaining                         |
| 11 — Polish → 12 — Deploy    | ⏳ Not started                                                                                  |

## Deployment

Hosted on **Vercel** with continuous deployment from `main` (push → build →
live); pull requests get their own preview URL. The GitHub Actions workflow
(`.github/workflows/ci.yml`) is a quality gate that runs typecheck, lint,
stylelint, format check and a production build — it does **not** deploy, and
holds no Vercel credentials.

Build settings live in `vercel.json`; Node is pinned to 20 via `.nvmrc` for
both CI and Vercel. No environment variables are required for a first deploy —
`siteUrl()` falls back to the URL Vercel injects at build time, so a deploy can
never publish `localhost` canonicals.

> ⚠ Not launch-ready: the contact form has no destination (C-09) and the admin
> panel cannot persist on serverless (C-02). See §5 of the deployment doc.

Full guide — Vercel import, env vars, custom domain and DNS, rollback,
troubleshooting and the pre-launch checklist — in
**[`docs/05-engineering/13-deployment.md`](./docs/05-engineering/13-deployment.md)**.

## Known blockers carried from the audit (Doc 12)

- **C-11** brand webfonts not licensed/present → running on fallback stacks.
- **C-05** Bonfire-Flame button contrast → must be resolved in Phase 2 before any button ships.
- **C-08** confirm canonical domain + contact facts.
- **C-02/C-09/C-10** backend, legal/privacy, English content → later phases.
- **C-04** admin data model must precede Services/Clients (workflow reorder).
