# Buyue (بيوع) — Documentation Package

The complete specification package for the Buyue website. It is the **single source of
truth**: no implementation decision may contradict it, and the approved Arabic content
(Doc 02) is final and verbatim.

> **Project:** Buyue Corporate Website — a 5-page bilingual (Arabic-first / English-second)
> marketing site for بيوع | Buyue, an integrated marketing & branding agency and operating
> brand of Noble Business Group (KSA & Egypt).

## How this folder is organised

Documents are grouped by **discipline** (the folders) but keep their **original document
numbers** (the filename prefixes). The numbers are permanent IDs, not an ordering — roughly
159 code comments across `src/` cite them as `Doc 07 §6`, `Doc 03 §11`, and so on. Renumbering
would break that traceability, so a document's number never changes even if it moves folder.

```
docs/
├── 01-project/       Why the site exists, and what is blocking it
├── 02-brand/         What it looks like, and how it should feel
├── 03-content/       What it says, in both languages
├── 04-design/        How it is laid out, built, and animated
├── 05-engineering/   How it is coded and delivered
└── assets/           Source material the documents were written from
```

## Reading order

New to the project? Read 01 → 02 → 03 → 04 → 05 → 07 → 09 → 10 → 11, then 12.
Shipping it? Read [13 — Deployment](05-engineering/13-deployment.md).

### 01 — Project

| # | Document | What it defines |
|---|----------|-----------------|
| 01 | [Project Overview](01-project/01-project-overview.md) | Vision, goals, audience, positioning, IA, CTAs, success criteria, assumptions, constraints, scalability |
| 12 | [Pre-Development Audit](01-project/12-pre-development-audit.md) | Adversarial readiness review; the `C-##`/`H-##` blocker register cited throughout the codebase |

### 02 — Brand

| # | Document | What it defines |
|---|----------|-----------------|
| 03 | [Brand Guidelines](02-brand/03-brand-guidelines.md) | Full design system — colors, type, spacing, components, dark/light, accessibility |
| 04 | [Creative Direction](02-brand/04-creative-direction.md) | Feel, emotion, mood, luxury/modernity scales, cinematic & premium principles |

### 03 — Content

| # | Document | What it defines |
|---|----------|-----------------|
| 02 | [Content Master](03-content/02-content-master.md) | **All approved Arabic content, verbatim.** Opens with the binding content rule |
| 08 | [Translation Guidelines](03-content/08-translation-guidelines.md) | Arabic→English localization standard, with good vs. bad examples |

### 04 — Design

| # | Document | What it defines |
|---|----------|-----------------|
| 09 | [UI/UX Blueprint](04-design/09-ux-blueprint.md) | UX architecture + per-page layout blueprints (desktop/tablet/mobile, priorities, DoD) |
| 10 | [Component System](04-design/10-component-system.md) | Full design-system component library (~44 components, each fully specified) |
| 05 | [Animation System](04-design/05-animation-system.md) | Complete motion spec — philosophy, per-section rules, timing/easing, accessibility & performance |
| 06 | [Reference Library](04-design/06-reference-library.md) | Benchmark index (azure.sa, above-limits.com) + template for future references |

### 05 — Engineering

| # | Document | What it defines |
|---|----------|-----------------|
| 07 | [Development Rules](05-engineering/07-development-rules.md) | Engineering rulebook — content, Arabic/RTL, components, a11y, perf, SEO, Definition of Done, QA |
| 11 | [Build Workflow](05-engineering/11-build-workflow.md) | Phased, review-gated implementation process — 15 reviews, quality gates, polish, launch |
| 13 | [Deployment](05-engineering/13-deployment.md) | Vercel hosting — import, env vars, custom domain, rollback, production gaps, pre-launch checklist |

## Foundation facts (source of truth)

- **Pages:** Home · About Us · Our Services · Our Clients · Contact Us. Admin panel manages **Services** and **Clients**.
- **Languages:** Arabic (primary/source, RTL) + English (translated from Arabic, LTR).
- **Colors:** Bonfire Flame `#cf5138` · Black Powder `#2f2f2d` · Quilt Gold `#eac46b` · Springtime Rain `#f5f7f9` · Lime Taffy `#bbcfb3`.
- **Type:** Arabic → 29LT Zarid · English → Articulat V3.
- **Animation benchmarks:** azure.sa, above-limits.com (feel/quality only — not to copy).

## ⚠ Open items to confirm with the client

Tracked formally as `C-##` / `H-##` findings in [Doc 12](01-project/12-pre-development-audit.md).

1. **Email/domain discrepancy** (C-08) — content uses `info@beuyue.com`; brand file uses `buyue.com` / `buyue.sa`. Confirm the correct email and domain. *(Do not guess.)*
2. **Second phone number** — confirm exact digits/format of the second Khobar number.
3. **`⚠ VERIFY` Arabic strings** in Doc 02 — verify character-by-character against the client's original content file (PDF extraction may carry artifacts).
4. **Font licensing** (C-11) — confirm web-embedding licenses for 29LT Zarid and Articulat V3. Until then the site runs on fallback stacks.
5. **Final client logo list** — confirm canonical set (source lists differ slightly between pages).
6. **Numeral system** (Arabic-Indic vs. Western) — confirm and apply consistently.
7. **English content approval** (C-10) — the English catalogue is provisional and *not* client-approved.

## Source materials

Originals live in [`assets/`](assets/); the brand marks and client logo files live in
[`../brand-assets/`](../brand-assets/).

| File | Contains |
|------|----------|
| [`assets/requirements.pdf`](assets/requirements.pdf) | Scope, pages, admin panel, colors, fonts, languages, animation references |
| [`assets/website-content.pdf`](assets/website-content.pdf) | All approved Arabic content + SEO metadata |
| [`assets/buyue-branding.pdf`](assets/buyue-branding.pdf) | Visual identity: colors, fonts, logo, photography direction, contact details |
| [`assets/buyue-company-portfolio.pdf`](assets/buyue-company-portfolio.pdf) | Company portfolio |
| [`assets/buyue-projects-list.xlsx`](assets/buyue-projects-list.xlsx) | Project/client list |

---

*This package was written pre-build as a handover specification. Implementation has since
begun — see the build-status table in the [root README](../README.md) for current phase state.*
