# Buyue (بيوع) — Website Pre-Build Documentation Package

This folder is the complete handover package prepared **before** any website is built. It contains everything an engineer or designer needs to build the Buyue site — with **no code written yet**.

> **Project:** Buyue Corporate Website — a 5-page bilingual (Arabic-first / English-second) marketing site for بيوع | Buyue, an integrated marketing & branding agency and operating brand of Noble Business Group (KSA & Egypt).

## Read the documents in order

| # | Document | What it defines |
|---|----------|-----------------|
| 01 | [Project Overview](01_Project_Overview.md) | Vision, goals, audience, positioning, IA, CTAs, success criteria, assumptions, constraints, scalability |
| 02 | [Content Master](02_Content_Master.md) | **All approved Arabic content, verbatim.** Starts with the binding content rule |
| 03 | [Brand Guidelines](03_Brand_Guidelines.md) | Full design system — colors, type, spacing, components, dark/light, accessibility |
| 04 | [Creative Direction](04_Creative_Direction.md) | Feel, emotion, mood, luxury/modernity scales, cinematic & premium principles |
| 05 | [Animation System](05_Animation_System.md) | Complete motion spec — philosophy, per-section rules, timing/easing, accessibility & performance |
| 06 | [Reference Library](06_Reference_Library.md) | Benchmark index (azure.sa, above-limits.com) + template for future references |
| 07 | [Development Rules](07_Development_Rules.md) | Engineering rulebook — content, Arabic/RTL, components, a11y, perf, SEO, Definition of Done, QA |
| 08 | [Translation Guidelines](08_Translation_Guidelines.md) | Arabic→English localization standard, with good vs. bad examples |
| 09 | [UI/UX Blueprint](09_UI_UX_Blueprint.md) | UX architecture + per-page layout blueprints (desktop/tablet/mobile, priorities, DoD) |
| 10 | [Component System](10_Component_System.md) | Full design-system component library (~44 components, each fully specified) |
| 11 | [Build Workflow](11_Build_Workflow.md) | Phased, review-gated implementation process — 15 reviews, quality gates, polish, launch |

## Foundation facts (source of truth)

- **Pages:** Home · About Us · Our Services · Our Clients · Contact Us. Admin panel manages **Services** and **Clients**.
- **Languages:** Arabic (primary/source, RTL) + English (translated from Arabic, LTR).
- **Colors:** Bonfire Flame `#cf5138` · Black Powder `#2f2f2d` · Quilt Gold `#eac46b` · Springtime Rain `#f5f7f9` · Lime Taffy `#bbcfb3`.
- **Type:** Arabic → 29LT Zarid · English → Articulat V3.
- **Animation benchmarks:** azure.sa, above-limits.com (feel/quality only — not to copy).

## ⚠ Open items to confirm with the client before build

1. **Email/domain discrepancy** — content uses `info@beuyue.com`; brand file uses `buyue.com` / `buyue.sa`. Confirm the correct email and domain. *(Do not guess.)*
2. **Second phone number** — confirm exact digits/format of the second Khobar number.
3. **`⚠ VERIFY` Arabic strings** in Document 02 — verify character-by-character against the client's original content file (PDF extraction may carry artifacts).
4. **Font licensing** — confirm web-embedding licenses for 29LT Zarid and Articulat V3.
5. **Final client logo list** — confirm canonical set (source lists differ slightly between pages).
6. **Numeral system** (Arabic-Indic vs. Western) — confirm and apply consistently.

## Source materials these docs are built from
- `Requiremnet.pdf` — scope, pages, admin panel, colors, fonts, languages, animation references.
- `website content.pdf` — all approved Arabic content + SEO metadata.
- `buyue Branding.pdf` — visual identity: colors, fonts, logo, photography direction, contact details.

---

*Prepared as a pre-build documentation package. No HTML, CSS, or application code has been written at this stage.*
