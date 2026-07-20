# 03 — Brand Guidelines & Design System
### Buyue (بيوع) — Visual Language Specification

> **Purpose:** Define the complete, reusable visual system so any designer or engineer can produce on-brand screens without guessing. All values here derive from the supplied brand identity file (`buyue Branding.pdf`). Colors, fonts, and logo are **fixed** — this document systematizes them for web.

---

## 1. Brand Personality

Buyue is **rooted yet modern, confident yet warm, precise yet human.** The brand explicitly "reflects the spirit of modern Saudi Arabia: authentic in its roots, progressive in its thinking, and focused on real market impact."

**Personality traits (design must express all five):**
1. **Authentic (أصيل)** — grounded in Saudi/Gulf heritage; warm, genuine, culturally fluent.
2. **Modern (متطور)** — geometric, clean, contemporary; never dated or ornate.
3. **Confident (واثق)** — bold statements, strong contrast, unafraid of space and scale.
4. **Precise (دقيق)** — golden-ratio logic, disciplined grids, meticulous detail.
5. **Impactful (مؤثر)** — everything earns its place; substance over decoration ("نبيع كل شيء إلا الكلام").

**Personality dial (0–10):**
| Trait | Value | Note |
|-------|-------|------|
| Warmth | 7 | Earthy terracotta + human photography |
| Boldness | 8 | Strong color blocks, confident type |
| Minimalism | 7 | Generous space, restrained ornament |
| Craft/precision | 9 | Golden-ratio mark, tight system |
| Playfulness | 3 | Serious, but not cold |

---

## 2. Design Philosophy

**"Understand before you execute."** The same principle that drives Buyue's work drives its design system: structure first, expression second.

- **Systematic, not decorative** — every element follows a rule (spacing scale, type scale, color roles). Ornament is earned, not default.
- **Contrast as a tool** — the terracotta/near-black/off-white relationship creates drama and hierarchy with very few elements.
- **Cultural duality** — Arabic (primary, RTL) and Latin (secondary, LTR) coexist as equals in craft, mirrored in layout.
- **Cinematic restraint** — premium comes from confidence and space, not busyness.
- **Function is beauty** — legibility, clarity, and performance are non-negotiable aesthetics.

---

## 3. Visual Language

The Buyue visual language is built from four recognizable devices:

1. **The geometric Arabic wordmark** — the «بيوع» mark, engineered on the golden ratio, sitting inside a stable rectangle. It is the brand's signature shape.
2. **The angular "carpet-stripe" motif** — the diagonal, banded forms derived from the logo's letter construction (seen in the social templates on brand page 9) — usable as section dividers, image masks, and background texture.
3. **Bold color blocking** — full-bleed panels of Bonfire Flame, Black Powder, Lime Taffy, or Quilt Gold, with type reversed out.
4. **Warm, human, Saudi-context photography** — real people, desert/sky, heritage-meets-modern scenes, treated with brand-color overlays.

**The "X" stitch pattern** (brand page 12, orange cross-stitch) is a supporting texture referencing traditional craft — usable sparingly as a decorative rule/border.

---

## 4. Typography

### 4.1 Arabic Font — 29LT Zarid
- **Family:** `29LT Zarid` (display) and `29LT Zarid Text` (body).
- **Role:** Primary typeface for all Arabic — headings and body. It "merges authenticity and modernity," is rooted in classical Arabic calligraphy but engineered for contemporary clarity.
- **Weights available:** Light · Regular · Medium · Bold.
- **Usage:**
  - Headlines/display → `29LT Zarid` Bold or Medium.
  - Long-form body → `29LT Zarid Text` Regular (designed for reduced eye fatigue in continuous reading).
  - Secondary headings / captions → Zarid Text Medium.
- **Character:** sharp, weighted strokes for a premium, confident presence; excellent screen and print legibility.

### 4.2 English Font — Articulat V3 (Articulat CF)
- **Family:** `Articulat V3` (aka Articulat CF).
- **Role:** All Latin/English text. Its geometric, neutral-yet-confident character harmonizes with Zarid and suits corporate/marketing tone.
- **Weights (recommended set):** Light · Regular · Medium · DemiBold/Bold.
- **Usage:** English headings, body, UI labels, and the "Buyue"/"BUYUE" Latin wordmark contexts.

### 4.3 Font Pairing & Bilingual Rules
- Arabic uses Zarid; English uses Articulat V3. **Never** substitute a system font for either without explicit fallback approval.
- **Fallback stacks (for load resilience only):**
  - Arabic: `29LT Zarid, "Noto Naskh Arabic", "Segoe UI", Tahoma, sans-serif`
  - Latin: `Articulat V3, "Inter", "Helvetica Neue", Arial, sans-serif`
- Match **optical size and weight** across languages so an AR heading and its EN translation read at equal visual strength.
- Arabic runs right-to-left (`dir="rtl"`); Latin left-to-right (`dir="ltr"`). Mixed strings (e.g., "SEO", "Buyue") must not break RTL flow — isolate with bidi controls where needed.

### 4.4 Font Hierarchy (type scale)

A modular scale (ratio ≈ 1.25) tuned for a premium, spacious feel. Sizes are desktop; scale down ~10–20% on mobile (see responsive rules).

| Token | Use | Size (px) | Weight | Line-height | Letter-spacing |
|-------|-----|-----------|--------|-------------|----------------|
| Display | Hero headline | 64–80 | Bold | 1.05 | tight (AR: normal) |
| H1 | Page title | 48 | Bold | 1.1 | tight |
| H2 | Section heading | 36 | Bold/Medium | 1.15 | normal |
| H3 | Sub-section | 28 | Medium | 1.2 | normal |
| H4 | Card title | 22 | Medium | 1.25 | normal |
| Body-L | Lead paragraph | 20 | Regular | 1.6 | normal |
| Body | Default text | 16–18 | Regular | 1.7 (AR), 1.6 (EN) | normal |
| Small | Captions/meta | 14 | Regular/Medium | 1.5 | normal |
| Overline | Eyebrow/badge | 12–13 | Medium | 1.4 | +0.08em (EN only) |

> **Arabic line-height rule:** Arabic needs slightly more leading than Latin; use ≥1.7 for Arabic body to accommodate diacritics and stroke height. **Never apply positive letter-spacing to Arabic** — it breaks letter joining.

---

## 5. Spacing System

An **8px base grid.** All spacing, sizing, and layout offsets are multiples of 8 (with a 4px half-step allowed for fine adjustments).

| Token | Value | Typical use |
|-------|-------|-------------|
| space-0 | 0 | reset |
| space-1 | 4px | icon gaps, fine tuning |
| space-2 | 8px | tight internal padding |
| space-3 | 12px | input padding |
| space-4 | 16px | default gap |
| space-5 | 24px | card padding, element spacing |
| space-6 | 32px | block spacing |
| space-8 | 48px | sub-section spacing |
| space-10 | 64px | section padding (mobile) |
| space-12 | 96px | section padding (desktop) |
| space-16 | 128px | large section separation |
| space-20 | 160px | hero/major breathing room |

**Section rhythm:** vertical section padding ≈ 96–128px desktop, 56–72px mobile. Generous whitespace is a core premium signal — do not crowd.

---

## 6. Grid System

- **Columns:** 12-column grid (desktop), 8-column (tablet), 4-column (mobile).
- **Gutter:** 24px desktop, 16px mobile.
- **Margins:** fluid; align to container (below).
- **RTL:** the grid mirrors for Arabic — column 1 starts at the right edge. Order and alignment flip; the grid math stays identical.
- **Baseline alignment:** align type to the 8px rhythm where practical.

---

## 7. Container Widths

| Breakpoint | Range | Container max-width | Margins |
|------------|-------|---------------------|---------|
| Mobile | ≤ 640px | 100% | 20px |
| Tablet | 641–1024px | 720–960px | 32px |
| Desktop | 1025–1440px | 1200px | auto |
| Wide | > 1440px | 1320px (content), full-bleed for color blocks | auto |

- **Content max-width for long Arabic paragraphs:** ~68–75 characters/line for readability (roughly 640–720px).
- **Full-bleed panels** (hero, color-block sections, galleries) extend edge-to-edge; inner content stays within the container.

---

## 8. Border Radius

A restrained radius scale — the brand's geometric logo favors crisp corners; softness is used sparingly for approachability.

| Token | Value | Use |
|-------|-------|-----|
| radius-none | 0 | logo lockups, hard color blocks, image masks |
| radius-sm | 4px | inputs, small tags |
| radius-md | 8px | buttons, cards |
| radius-lg | 16px | large cards, media containers |
| radius-xl | 24px | feature panels |
| radius-pill | 999px | pills/badges, icon buttons |

> Default to **8px** for interactive surfaces. Keep hero color-blocks and the angular motif **sharp (0)** to preserve the geometric identity.

---

## 9. Elevation Rules

Elevation communicates interactivity and layering, used sparingly for a flat-but-premium feel.

- **Level 0 — base:** page surfaces, color blocks. No shadow.
- **Level 1 — resting card:** subtle shadow; lifts content off the background.
- **Level 2 — hover/active card:** deeper, softer shadow + slight lift (translateY).
- **Level 3 — overlays:** modals, dropdowns, the language menu.
- **Level 4 — toasts/sticky nav on scroll:** pronounced but soft.

Rule: **light-mode uses soft, warm-tinted shadows; dark-mode replaces shadows with subtle borders/elevation-by-contrast** (shadows are nearly invisible on dark backgrounds).

---

## 10. Shadow System

Shadows are **low-opacity, warm-neutral, and diffuse** — never harsh black.

| Token | Value (light mode) |
|-------|--------------------|
| shadow-sm | `0 1px 2px rgba(47,47,45,0.06)` |
| shadow-md | `0 4px 12px rgba(47,47,45,0.08)` |
| shadow-lg | `0 12px 28px rgba(47,47,45,0.12)` |
| shadow-xl | `0 24px 48px rgba(47,47,45,0.16)` |
| shadow-focus | `0 0 0 3px rgba(207,81,56,0.35)` (Bonfire Flame focus ring) |

> Base shadow color is Black Powder (`#2f2f2d`) at low alpha — keeps shadows tonally on-brand. In dark mode, drop shadow opacity to near-zero and lean on `1px` borders in `rgba(245,247,249,0.08)`.

---

## 11. Color Palette

The five brand colors, exactly as supplied.

| Name | Hex | RGB | Role |
|------|-----|-----|------|
| **Bonfire Flame** | `#cf5138` | rgb(207,81,56) | **Primary** — brand terracotta/red; CTAs, key accents, brand blocks |
| **Black Powder** | `#2f2f2d` | rgb(47,47,45) | **Ink / dark** — primary text, dark backgrounds, footer |
| **Quilt Gold** | `#eac46b` | rgb(234,196,107) | **Accent** — highlights, secondary emphasis, warmth |
| **Springtime Rain** | `#f5f7f9` | rgb(245,247,249) | **Light surface** — page background, cards |
| **Lime Taffy** | `#bbcfb3` | rgb(187,207,179) | **Secondary** — soft sage panels, calm sections, supportive accents |

### 11.1 Primary Colors
- **Bonfire Flame `#cf5138`** — the hero of the palette. Use for primary buttons, active states, links (with care for contrast), key statistics, and full-bleed brand panels. Should appear on every page as the recognizable "Buyue" signal.
- **Black Powder `#2f2f2d`** — primary text on light, and the primary dark background. Anchors the palette and provides seriousness.

### 11.2 Secondary Colors
- **Lime Taffy `#bbcfb3`** — sage-green calm; used for alternating section backgrounds, supportive cards, and to balance the warmth of Bonfire Flame. Pairs beautifully with Black Powder type.

### 11.3 Accent Colors
- **Quilt Gold `#eac46b`** — the warm accent; small highlights, underlines, badges, hover glints, decorative motif fills. Use as a spark, not a field — it loses impact if overused.

### 11.4 Neutral Palette (derived — stay in family)
Derive neutrals from Black Powder and Springtime Rain so the greys read warm, not clinical.

| Token | Suggested value | Use |
|-------|------------------|-----|
| ink-900 | `#2f2f2d` (Black Powder) | primary text |
| ink-700 | `#4a4a47` | secondary text |
| ink-500 | `#6f6f6b` | muted text, captions |
| ink-300 | `#a8a8a3` | disabled, placeholders |
| line-200 | `#e2e4e6` | borders, dividers |
| surface-50 | `#f5f7f9` (Springtime Rain) | page background |
| surface-0 | `#ffffff` | elevated cards |

### 11.5 Semantic / System Colors (derived — not in core identity)
The identity has no explicit success/warning/danger. Derive them to sit beside the palette without clashing. **Confirm with client before use in UI.**

| Semantic | Suggested value | Note |
|----------|------------------|------|
| **Success** | `#4f9d69` | harmonizes with Lime Taffy; used for form success |
| **Warning** | `#eac46b` (Quilt Gold) | reuse the accent for warnings |
| **Danger** | `#cf5138` (Bonfire Flame) | reuse primary for errors/destructive |
| **Info** | `#5b7a8c` | muted teal-grey, neutral to the palette |

> Because Bonfire Flame doubles as Danger, ensure error states are also signalled by icon + text, not color alone (accessibility).

---

## 12. Background Rules

- **Default page background:** Springtime Rain `#f5f7f9` (light mode).
- **Alternating sections:** rotate between Springtime Rain, white, Lime Taffy, and (occasionally) Black Powder for a full-bleed dark break.
- **Brand/CTA panels:** Bonfire Flame full-bleed with reversed (Springtime Rain/white) type.
- Avoid placing three saturated color fields adjacently — always separate strong panels with a neutral.
- Photography backgrounds must carry a brand-color overlay or scrim to keep text legible (see Photography).

---

## 13. Surface Rules

- **Cards:** white or Springtime Rain on light backgrounds; on dark sections, cards are a slightly lighter Black Powder tint or bordered.
- **Nesting:** limit surface nesting to 2 levels (page → card → inner element) to avoid muddy layering.
- **Elevation vs. fill:** prefer subtle fill/border changes over heavy shadows for separating surfaces.
- Maintain the 8px spacing rhythm inside every surface.

---

## 14. Border Rules

- **Default border:** 1px, `line-200` (`#e2e4e6`) light mode; `rgba(245,247,249,0.10)` dark mode.
- **Emphasis border:** 1–2px Bonfire Flame for selected/active states.
- **Motif border:** the Quilt Gold "X-stitch" pattern may be used as a decorative rule — sparingly, never around body text.
- Keep borders subtle; the brand leans on space and color-block contrast more than lines.

---

## 15. Button Styles

| Variant | Fill | Text | Border | Use |
|---------|------|------|--------|-----|
| **Primary** | Bonfire Flame `#cf5138` | Springtime Rain/white | none | main CTAs (ابدأ مشروعك معنا, أرسل طلبك الآن) |
| **Secondary** | transparent | Black Powder | 1.5px Black Powder | secondary actions (استعرض أعمالنا) |
| **Ghost / text** | transparent | Bonfire Flame | none | tertiary/inline links |
| **On-dark primary** | Springtime Rain | Black Powder | none | CTAs on Bonfire Flame / dark panels |
| **On-dark secondary** | transparent | Springtime Rain | 1.5px Springtime Rain | secondary on dark |

**Button rules:**
- Padding: 14px 28px (default), radius 8px (`radius-md`).
- Min touch target: 44×44px.
- States: default → hover (slight darken/lift + shadow-md) → active (scale 0.98) → focus (Bonfire Flame focus ring) → disabled (ink-300, no shadow).
- Label typography: Zarid Medium (AR) / Articulat V3 Medium (EN), 16px.
- Only **one** primary button per view region; pair with a secondary, never two primaries.

---

## 16. Card Styles

- **Structure:** padding 24–32px, radius 8–16px, shadow-sm at rest, shadow-md on hover with a 2–4px lift.
- **Service card:** icon/number + title (H4) + short body; optional "القيمة" line; hover reveals accent (Bonfire Flame edge or Quilt Gold underline).
- **Value/why card:** title + body, minimal chrome, generous space.
- **Client logo card:** neutral surface, logo centered, grayscale→color on hover (optional), consistent aspect ratio.
- **Gallery card:** image-first, radius 8px, angular-motif mask optional, caption on hover.
- Maintain equal heights within a row; align to grid.

---

## 17. Input Styles

- **Field:** height 48px, radius 4–8px, 1px `line-200` border, 12–16px padding, Springtime Rain/white fill.
- **Label:** above field, Small/Medium, Black Powder; Arabic labels right-aligned in RTL.
- **Placeholder:** ink-300; never the only label (accessibility).
- **Focus:** border → Bonfire Flame + focus ring (`shadow-focus`).
- **Error:** border Bonfire Flame + inline error text + icon.
- **Success:** subtle Success border + check icon.
- **Textarea (المشروع brief):** min height 120px.
- **Select (نوع الخدمة المطلوبة):** consistent with input styling; RTL-aware caret.
- Form respects RTL: field order, label alignment, and icon placement mirror for Arabic.

---

## 18. Iconography

- **Style:** geometric line icons, ~1.5–2px stroke, rounded joins, matching the modern-geometric brand feel.
- **Grid:** 24px icon grid; consistent optical weight.
- **Color:** inherit text color; accent icons may use Bonfire Flame or Quilt Gold.
- **RTL:** directional icons (arrows, chevrons) **mirror** for Arabic.
- **Don't:** mix icon styles (no filled + outline mix in one set); no skeuomorphic or emoji icons in UI.
- Service icons should feel like a cohesive family — commission or select one consistent set.

---

## 19. Illustration Style

- **Approach:** geometric, flat, derived from the logo's angular "carpet-stripe" language and the golden-ratio construction.
- **Palette:** the five brand colors only; flat fills, minimal gradients.
- **Motifs:** the angular banded shapes, the X-stitch, and abstracted Arabic letterforms are the sanctioned illustrative devices.
- Illustrations support content — they never compete with photography or type for attention.

---

## 20. Photography Direction

Guided directly by the brand file's imagery:

- **Subjects:** real people in professional and Saudi-cultural contexts (office/creative work, desert & sky, heritage-meets-modern), products, events, exhibition stands.
- **Mood:** warm, cinematic, authentic; natural light; a sense of place (Saudi/Gulf).
- **Treatment:** brand-color overlays and angular masks (the logo-derived shapes) are a signature — images are often cropped inside the "carpet-stripe" motif or tinted with Bonfire Flame / Lime Taffy / Black Powder scrims.
- **Color grade:** warm, slightly earthy; avoid cold/blue-heavy grading except intentional sky/sea shots.
- **Composition:** confident, spacious, rule-of-thirds; leave room for reversed type.
- **Consistency:** all client-supplied project photos should be color-treated to a consistent grade before publishing.
- **Avoid:** generic stock clichés, cold corporate handshakes, low-quality or inconsistent-grade images.

---

## 21. Logo Usage Notes

- **Marks:** (a) the geometric Arabic wordmark «بيوع» in its rectangle; (b) the Latin "BUYUE" / "Buyue" wordmark. They may lock up together or appear standalone.
- **Construction:** golden-ratio based — do not distort, re-space, or reconstruct.
- **Color versions:** the logo is supplied on all five brand colors (Bonfire Flame, Black Powder, Quilt Gold, Springtime Rain, Lime Taffy). Choose the version with sufficient contrast against its background.
- **Clear space:** minimum clear space around the mark = the height of the "B" in BUYUE (≥ the width of one logo stripe). Keep it clear of clutter.
- **Minimum size:** ensure the Arabic strokes remain legible — recommend ≥ 32px height for the icon mark in nav; ≥ 24px favicon-scale only for the simplified mark.
- **Don'ts:** don't stretch, rotate, recolor outside the palette, add effects/shadows to the mark, place on low-contrast/ busy backgrounds, or alter letter spacing.
- **Favicon / app icon:** use the compact rectangular Arabic mark on Bonfire Flame or Black Powder.

---

## 22. Dark Mode Rules

- **Base background:** Black Powder `#2f2f2d` (and a slightly deeper `#262624` for recessed areas).
- **Text:** Springtime Rain `#f5f7f9` primary; muted greys for secondary (`rgba(245,247,249,0.72)`).
- **Primary color:** Bonfire Flame stays as the CTA/accent (verify contrast; it passes on dark).
- **Accents:** Quilt Gold and Lime Taffy read beautifully on Black Powder — use for highlights.
- **Surfaces:** cards = lighter tint of Black Powder or 1px light border; shadows replaced by contrast/borders.
- **Images:** reduce overlay intensity slightly; ensure reversed text remains legible.
- **Toggle:** if a dark/light toggle is offered, persist the user's choice; respect `prefers-color-scheme` on first visit.

> Dark mode is a strong fit for this brand's cinematic personality (the brand file itself favors dark panels). Recommend building light-first with a fully-specified dark theme.

---

## 23. Light Mode Rules

- **Base background:** Springtime Rain `#f5f7f9`; cards on white.
- **Text:** Black Powder `#2f2f2d` primary; ink-500/700 for secondary.
- **Primary color:** Bonfire Flame CTAs; ensure ≥4.5:1 contrast for any Bonfire-Flame text on light (large text ≥3:1). For body-size links on light, prefer Black Powder with Bonfire Flame underline/hover to guarantee contrast.
- **Panels:** alternate Springtime Rain / Lime Taffy / white; occasional Bonfire Flame or Black Powder full-bleed for drama.
- Keep it airy — light mode leans on whitespace and color-block accents.

---

## 24. Accessibility Requirements

- **Standard:** WCAG 2.1 AA minimum.
- **Contrast:**
  - Body text ≥ 4.5:1; large text (≥24px or ≥19px bold) ≥ 3:1.
  - **Bonfire Flame `#cf5138` on white ≈ 3.6:1** → acceptable for large text/UI, **not** for small body text. Use Black Powder for small text; reserve Bonfire Flame for large headings, buttons (with white text: white-on-Bonfire ≈ 3.9:1, use ≥18px bold), and non-text accents.
  - **Quilt Gold and Lime Taffy are light** → use only with Black Powder text, never white text, and not for small text on light backgrounds.
- **Never rely on color alone** to convey meaning (errors, status) — pair with text/icon.
- **Focus states:** visible focus ring (Bonfire Flame) on every interactive element; logical tab order (respect RTL).
- **Keyboard:** all functionality operable without a mouse; no keyboard traps; skip-to-content link.
- **Screen readers:** correct `lang`/`dir`, semantic landmarks, alt text (bilingual), ARIA only where semantics fall short.
- **Motion:** honor `prefers-reduced-motion` (see Document 05).
- **Touch targets:** ≥ 44×44px.
- **Forms:** every field has a persistent visible label; errors announced programmatically.

---

## 25. Responsive Design Rules

- **Breakpoints:** mobile ≤640, tablet 641–1024, desktop 1025–1440, wide >1440.
- **Mobile-first:** design and build from small up; enhance for larger screens.
- **Type:** scale display/headings down 10–20% on mobile; keep body ≥16px.
- **Spacing:** reduce section padding to ~56–72px on mobile.
- **Grid:** 12 → 8 → 4 columns; stack multi-column layouts to single column on mobile.
- **RTL + responsive:** verify mirroring at **every** breakpoint, not just desktop.
- **Media:** `max-width:100%`; art-direct hero/gallery crops per breakpoint; wide tables/galleries scroll within their own container (never the page body).
- **Touch:** hover-only interactions must have a tap equivalent; sticky nav condenses to a mobile menu.
- **Test matrix:** iOS Safari, Android Chrome, desktop Chrome/Firefox/Safari/Edge — in both AR (RTL) and EN (LTR).

---

## 26. Design Tokens Summary (hand-off reference)

```
Colors
  --color-bonfire-flame:  #cf5138
  --color-black-powder:   #2f2f2d
  --color-quilt-gold:     #eac46b
  --color-springtime-rain:#f5f7f9
  --color-lime-taffy:     #bbcfb3

Type
  --font-arabic:  "29LT Zarid" (display), "29LT Zarid Text" (body)
  --font-latin:   "Articulat V3"
  weights: 300 / 400 / 500 / 700

Radius:   0 / 4 / 8 / 16 / 24 / 999
Spacing:  4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 (8px base)
Container:1200 (desktop) / 1320 (wide)
Shadows:  sm / md / lg / xl + focus (Bonfire Flame ring)
```

---

*End of Document 03 — Brand Guidelines & Design System.*
