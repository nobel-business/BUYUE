# Buyue (بيوع) — Website

Premium, bilingual (**Arabic-first / English-second**) marketing website for
**بيوع | Buyue**, an integrated marketing & branding agency (operating brand of
Noble Business Group).

> **Single source of truth:** the [`Documentation/`](./Documentation) package
> (Docs 01–12). No implementation decision may contradict it. Arabic content is
> **final and verbatim** (Doc 02) — never rewrite, translate, or invent it.

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
  app/[locale]/     App Router (locale-segmented): layout, page, not-found
  i18n/             routing + per-request message config
  messages/         ar.json / en.json  (verbatim content, added per phase)
  styles/           reset · tokens (brand colors) · globals
  lib/              fonts (loader architecture)
  components/        (Phase 2+)
public/fonts/        drop licensed 29LT Zarid + Articulat V3 here (see README)
```

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

## Known blockers carried from the audit (Doc 12)

- **C-11** brand webfonts not licensed/present → running on fallback stacks.
- **C-05** Bonfire-Flame button contrast → must be resolved in Phase 2 before any button ships.
- **C-08** confirm canonical domain + contact facts.
- **C-02/C-09/C-10** backend, legal/privacy, English content → later phases.
- **C-04** admin data model must precede Services/Clients (workflow reorder).
