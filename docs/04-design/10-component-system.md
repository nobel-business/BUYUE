# 10 — Component System
### Buyue (بيوع) — Design System Component Library

> **Purpose:** The complete, reusable component library for the Buyue website. Every recurring UI element is documented here so it is built once and reused everywhere — guaranteeing consistency, accessibility, RTL parity, and performance. This is the bridge between the design system (Doc 03), the UX blueprint (Doc 09), the motion system (Doc 05), and the engineering rulebook (Doc 07).
>
> **Inheritance:** Colors, type, spacing, radius, shadows come from **Doc 03**. Motion tokens (durations, easings, stagger, reveal patterns) come from **Doc 05**. RTL/bilingual, accessibility, and performance mandates come from **Doc 07**. Component usage/placement comes from **Doc 09**. This document does not re-define tokens — it *consumes* them.

---

## PART A — SYSTEM FOUNDATIONS

### 1. Design Philosophy

The component system exists to make the site **systematic, consistent, and premium** with the least possible duplication. Guiding beliefs:

1. **Build once, reuse everywhere.** Every recurring pattern is a single prop-driven component (Doc 07 §3). No copy-paste variants.
2. **Composition over configuration.** Prefer small components composed together (Field = Label + Control + Error) over monolithic, deeply-configured ones.
3. **Tokens, never magic numbers.** Every color, space, radius, shadow, duration, and easing references a token from Doc 03/Doc 05.
4. **Bilingual & bidirectional by default.** Every component works in RTL (Arabic, primary) and LTR (English) from a single implementation, using logical properties (Doc 07 §12).
5. **Every state is designed.** default · hover · focus · active · disabled · loading · empty · error · success — as applicable (Doc 07 §3).
6. **Accessible and performant as a baseline,** not a retrofit.

### 2. Naming Convention

Follows Doc 07 §11:
- **Components:** `PascalCase` (`ServiceCard`, `LanguageSwitcher`); file names match.
- **Variants:** semantic names (`primary`, `secondary`, `ghost`, `on-dark`), never visual literals (`orangeButton`).
- **Props:** `camelCase`; booleans read as predicates (`isLoading`, `hasError`, `isOpen`).
- **Tokens in components:** semantic token names only (`color-bonfire-flame`, `space-4`, `radius-md`, `dur-medium`).
- **Content keys:** locale-namespaced, stable (`services.faq.q1`).
- Same concept → same name across the codebase.

### 3. Composition Rules

- Components are **content-agnostic**: they receive content/data via props; they never hardcode approved copy (Doc 07 §1, §3).
- Compose complex UI from primitives: `Form` ← `Field` ← (`Label` + `Input`/`Textarea`/`Dropdown` + `ErrorState`).
- Keep components **shallow**; avoid deep prop-drilling — compose or use context where justified.
- Layout components (`Container`, `Section`, `Grid`) wrap content components; content components don't own page-level layout.
- Slots/children over rigid props where flexibility is needed (e.g., `Card` accepts a media slot, body slot, footer slot).

### 4. Reusability Rules

- A pattern used more than once **must** become a shared component.
- New needs **extend** an existing component (new variant/prop) rather than forking a near-duplicate.
- Variants are additive and documented; no undocumented one-offs.
- Components live in one library, imported everywhere; there is no page-local redefinition.
- Breaking changes to a shared component require a review (Doc 11 quality gates).

### 5. Global Variants & States (apply to all where relevant)

- **Theme variants:** light (default) / dark (Doc 03 §22–23) / on-color (over Bonfire Flame or Black Powder blocks).
- **Direction:** rtl (default) / ltr — single implementation, mirrored via logical properties.
- **Density:** default; compact where space-constrained (mobile).
- **States:** default · hover · focus-visible · active/pressed · disabled · loading · empty · error · success (as applicable).

### 6. Global Accessibility Baseline (every component)

- Semantic HTML first; ARIA only to fill gaps (Doc 07 §5).
- Keyboard operable; visible **branded** focus ring (Bonfire Flame, Doc 03 §10).
- Contrast per Doc 03 §24 (no small Bonfire-Flame/Quilt-Gold/Lime-Taffy text on light).
- Never color-only meaning; pair with icon/text.
- Correct `lang`/`dir`; bidi isolation for embedded Latin/numbers.
- Touch targets ≥44×44px.
- Respects `prefers-reduced-motion` (Doc 05 §33).

### 7. Global RTL/LTR Rules (every component)

- Default `dir="rtl"` (Arabic primary).
- Use logical CSS (inline-start/inline-end, margin-inline, etc.) so mirroring is automatic (Doc 07 §12).
- Directional icons (arrows, chevrons) mirror in RTL.
- All directional motion mirrors (Doc 05).
- No positive letter-spacing on Arabic; Arabic body line-height ≥1.7.

### 8. Global Performance Baseline (every component)

- Animate transform/opacity only; 60fps (Doc 05 §34, Doc 07 §16).
- Lazy-load heavy media/children below the fold (Doc 07 §15).
- No CLS: reserve dimensions for media and async content.
- Minimal JS; prefer CSS for transitions/layout; code-split heavy interactive components (sliders, lightbox).

### 9. Documentation Rules (per component)

Each component in this library is documented with: **Purpose · Description · Variants · Properties · States · Spacing · Typography · Icons · Animations · Responsive Behaviour · Accessibility · RTL Rules · Performance Considerations · Developer Notes · Common Mistakes · Definition of Done.** New components added later must follow the same template.

### 10. Universal Component Definition of Done

A component is Done when: all variants/states implemented · tokenized (no magic numbers) · AR(RTL)+EN(LTR) verified · fully keyboard/AT accessible with branded focus · motion follows Doc 05 with reduced-motion fallback · responsive across breakpoints · no CLS/60fps · documented (props/variants) · reviewed. Individual components add specifics below.

---

## PART B — COMPONENT LIBRARY

> Format per component follows Doc §9. Shared baselines (Accessibility §6, RTL §7, Performance §8) apply to all; each entry notes only its *additional* specifics.

---

### 1. Navigation (Header)

- **Purpose:** Persistent global wayfinding + primary CTA + language switch across all pages (Doc 09 §9).
- **Description:** Top bar with logo (start edge), nav links (Home · About · Services · Clients · Contact), a persistent Contact CTA, and the LanguageSwitcher (opposite edge). Condenses on scroll.
- **Variants:** transparent-over-hero · solid/condensed (on scroll) · dark-section · mobile (→ Mobile Menu).
- **Properties:** `items[]`, `activeItem`, `variant`, `locale`, `isScrolled`, `ctaLabel/href`.
- **States:** default · scrolled/condensed · hidden (scroll-down) · revealed (scroll-up) · link hover/active/focus.
- **Spacing:** container-aligned; comfortable link gaps (space-4/6); condensed height reduces vertical padding.
- **Typography:** nav links Zarid/Articulat Medium 16px; active link weight/color emphasis.
- **Icons:** hamburger (mobile), chevrons for any submenu, globe/AR-EN for language.
- **Animations:** condense on scroll (dur-base); hide/reveal (dur-base); active-link indicator slides (Bonfire Flame); mirror for RTL (Doc 05 §5).
- **Responsive Behaviour:** desktop full bar → tablet condensed → mobile hamburger + Mobile Menu.
- **Accessibility:** `<header>`/`<nav>` landmarks; skip-to-content link; `aria-current` on active; focus order RTL-aware.
- **RTL Rules:** logo at right, switcher/CTA at left; order mirrors.
- **Performance:** minimal JS; scroll handler throttled/`IntersectionObserver`.
- **Developer Notes:** one component drives desktop + mobile; nav data is a single source.
- **Common Mistakes:** forgetting `aria-current`; non-mirrored order in RTL; janky scroll listener; CTA competing with an in-page primary.
- **Definition of Done:** universal DoD + condense/hide-reveal smooth, active indicator correct, mobile menu wired, AR/EN mirrored.

---

### 2. Mega Menu

- **Purpose:** Optional expanded menu for grouped navigation (e.g., jumping to specific Services).
- **Description:** A panel that drops from a nav item, presenting grouped links/sections (e.g., the 10 services) in columns.
- **Variants:** simple (single column) · multi-column (grouped) · with-media (feature promo).
- **Properties:** `groups[]`, `columns`, `triggerItem`, `isOpen`.
- **States:** closed · opening · open · closing · item hover/focus.
- **Spacing:** generous column gutters; grouped headings separated from links.
- **Typography:** group headings (H4/overline), links Body/Medium.
- **Icons:** optional per-item icons; chevron on trigger rotates.
- **Animations:** fade+drop reveal (dur-base, ease-out-soft); items stagger; RTL-mirrored (Doc 05 §5).
- **Responsive Behaviour:** desktop only; collapses into the Mobile Menu (accordion groups) on smaller screens.
- **Accessibility:** `aria-expanded`/`aria-controls` on trigger; menu keyboard-navigable; ESC closes; focus managed/returned.
- **RTL Rules:** columns flow right-to-left; panel aligns to trigger, mirrored.
- **Performance:** render on demand; avoid animating layout.
- **Developer Notes:** only introduce if navigation complexity warrants it (v1 has 5 pages — a Mega Menu is optional, most useful for Services deep-links).
- **Common Mistakes:** trapping focus; no keyboard support; overloading with too many columns.
- **Definition of Done:** universal DoD + keyboard + ESC + focus return, RTL columns, reduced-motion fallback.

---

### 3. Mobile Menu (Drawer Nav)

- **Purpose:** Full navigation on mobile/tablet.
- **Description:** A full-screen or drawer panel sliding from the start edge (right in RTL), listing nav items, CTA, and language switch.
- **Variants:** full-screen overlay · side drawer.
- **Properties:** `items[]`, `isOpen`, `locale`, `onClose`.
- **States:** closed · opening · open · closing; item hover/active/focus.
- **Spacing:** large tap-friendly rows (≥44px); generous vertical rhythm.
- **Typography:** larger link type (H4/Body-L) for touch.
- **Icons:** close (X); chevrons for any nested groups.
- **Animations:** slide-in from start edge + scrim fade; items stagger 60ms (Doc 05 §5); mirror for RTL; reduced-motion → quick fade.
- **Responsive Behaviour:** shown ≤ tablet; hidden on desktop.
- **Accessibility:** focus trapped while open; ESC + scrim click closes; focus returns to trigger; `aria-modal`; background inert.
- **RTL Rules:** slides from right; alignment mirrors.
- **Performance:** mount on open; unmount/hide on close; lock body scroll while open.
- **Developer Notes:** shares nav data with Header; body scroll-lock must not cause layout shift.
- **Common Mistakes:** unlocked background scroll; no focus trap; not mirroring slide direction.
- **Definition of Done:** universal DoD + focus trap, scroll lock, RTL slide, staggered entrance, reduced-motion.

---

### 4. Hero

- **Purpose:** Set tone and land the value proposition per page (Doc 09 per-page).
- **Description:** Full-bleed section with dominant heading, supporting line, CTAs, and key media/motif. Home hero carries «نبيع كل شيء إلا الكلام» + two CTAs.
- **Variants:** home (media + dual CTA) · page-header (About/Services/Clients/Contact — heading + lead) · dark/color-block · media-background.
- **Properties:** `heading`, `subheading`, `body`, `primaryCta`, `secondaryCta`, `media`, `variant`, `height`.
- **States:** default; media loaded/loading; CTA states.
- **Spacing:** maximum negative space; container-aligned content; hero height ~80–100vh (home), shorter for page headers.
- **Typography:** Display/H1 Zarid Bold; body Body-L.
- **Icons:** CTA icons (arrow, mirrored RTL).
- **Animations:** orchestrated entrance — background scale-settle, headline mask reveal, staggered body + CTAs (Doc 05 §6); optional parallax; reduced-motion → fades.
- **Responsive Behaviour:** heading scales but stays dominant; CTAs stack on mobile (primary first); media art-directed per breakpoint.
- **Accessibility:** heading = page H1; media has alt or is decorative; CTAs are real links/buttons; reduced-motion fallback.
- **RTL Rules:** anchor/media side and reveal directions mirror.
- **Performance:** hero media is the LCP — eager-load + optimized; defer secondary motion (Doc 07 §6).
- **Developer Notes:** one Hero component, variant-driven for all pages.
- **Common Mistakes:** crowding the hero; two competing primary CTAs; LCP media not optimized; overflow of long Arabic headings.
- **Definition of Done:** universal DoD + LCP<2.5s, single focal point, verbatim heading, AR/EN, orchestrated + reduced-motion.

---

### 5. Buttons

- **Purpose:** Trigger actions; primary conversion element (Doc 03 §15).
- **Description:** Text (+ optional icon) button in defined variants.
- **Variants:** primary (Bonfire Flame) · secondary (outline) · ghost/text · on-dark primary · on-dark secondary · icon-only.
- **Properties:** `label`, `variant`, `size`, `iconStart/iconEnd`, `href|onClick`, `isLoading`, `isDisabled`, `fullWidth`.
- **States:** default · hover · focus-visible · active/pressed · disabled · loading · (form) success morph.
- **Spacing:** padding 14×28px default; min target 44×44px; icon gap space-2.
- **Typography:** Zarid/Articulat Medium 16px.
- **Icons:** optional leading/trailing; mirror direction in RTL; nudge on hover.
- **Animations:** hover darken/lift + shadow (dur-fast); press scale 0.98 (dur-instant); loading spinner (stable width); success morph (Doc 05 §9).
- **Responsive Behaviour:** may go `fullWidth` on mobile; label wrapping avoided.
- **Accessibility:** real `<button>`/`<a>`; accessible name (icon-only → `aria-label`); focus ring; disabled not focusable-but-announced appropriately; loading announced.
- **RTL Rules:** icon side and hover nudge mirror.
- **Performance:** CSS-driven states; no layout-affecting animation.
- **Developer Notes:** one primary per view region (Doc 09 §10); use exact approved labels (Doc 02).
- **Common Mistakes:** two primaries adjacent; low-contrast Bonfire-Flame text sizes; width jump on loading; div-as-button.
- **Definition of Done:** universal DoD + all variants/states, stable loading width, accessible name, AR/EN.

---

### 6. Button Group

- **Purpose:** Present related actions together (e.g., hero primary + secondary).
- **Description:** A layout wrapper aligning 2+ buttons with consistent spacing and hierarchy.
- **Variants:** horizontal · stacked (mobile) · segmented (mutually-exclusive toggle).
- **Properties:** `buttons[]`, `orientation`, `align`.
- **States:** inherits Button states; segmented has selected state.
- **Spacing:** consistent gap (space-3/4); clear primary/secondary hierarchy.
- **Typography:** inherits Button.
- **Icons:** inherits Button.
- **Animations:** buttons may stagger in (Doc 05 §6/§29).
- **Responsive Behaviour:** horizontal → stacked on mobile (primary first).
- **Accessibility:** logical order; segmented uses radio/tab semantics.
- **RTL Rules:** order and alignment mirror.
- **Performance:** layout-only.
- **Developer Notes:** enforces the "one primary" rule visually.
- **Common Mistakes:** equal-weight primaries; wrong stack order on mobile.
- **Definition of Done:** universal DoD + hierarchy preserved, mobile stack order correct, RTL mirrored.

---

### 7. Cards (base)

- **Purpose:** Container primitive for modular content (Doc 03 §16).
- **Description:** A surface with padding, radius, optional media/header/body/footer slots; hover elevation.
- **Variants:** base · media-top · horizontal · bordered · elevated · on-dark.
- **Properties:** `media`, `title`, `body`, `footer`, `href`, `variant`, `interactive`.
- **States:** default · hover (lift + shadow) · focus (if linked) · pressed.
- **Spacing:** 24–32px padding; consistent internal rhythm.
- **Typography:** title H4; body Body.
- **Icons:** optional; consistent set.
- **Animations:** entrance fade+rise staggered; hover lift 2–4px + shadow-md (Doc 05 §8); reduced-motion → color-only.
- **Responsive Behaviour:** equal heights in a row; stack on mobile.
- **Accessibility:** if entire card is a link, wrap semantically; otherwise interactive elements inside are individually focusable; don't nest interactive-in-interactive.
- **RTL Rules:** media/text sides mirror; alignment logical.
- **Performance:** lazy-load card media; reserve media dimensions.
- **Developer Notes:** ServiceCard/ClientCard/GalleryItem/TestimonialCard extend this base.
- **Common Mistakes:** unequal heights; nested links; CLS from unsized media.
- **Definition of Done:** universal DoD + variants, equal-height rows, accessible link semantics, RTL.

---

### 8. Feature Card

- **Purpose:** Present a differentiator/value point (e.g., "لماذا تختار بيوع؟" 4 cards; Values on About).
- **Description:** Icon/number + title + short body; minimal chrome, generous space.
- **Variants:** icon-led · number-led · plain.
- **Properties:** `icon/number`, `title`, `body`.
- **States:** default · hover (subtle accent).
- **Spacing:** generous internal space; consistent across the set.
- **Typography:** title H4 Medium; body Body.
- **Icons:** one consistent icon family; accent color optional.
- **Animations:** staggered reveal; hover accent (Bonfire Flame edge / Quilt Gold underline).
- **Responsive Behaviour:** 4-up → 2×2 → single column.
- **Accessibility:** heading semantics; decorative icons hidden from AT.
- **RTL Rules:** icon/text alignment mirror.
- **Performance:** lightweight.
- **Developer Notes:** used for Home "Why Buyue" and About "Values" — verbatim content (Doc 02 §1.3, §2.4).
- **Common Mistakes:** inconsistent icon weights; uneven card heights.
- **Definition of Done:** universal DoD + consistent set, staggered reveal, RTL.

---

### 9. Service Card

- **Purpose:** Represent a Buyue service (Doc 02 §3.2) — **admin-editable**.
- **Description:** Title + intro + "ماذا نقدم؟" feature list + القيمة value line; may be a card in a grid or a full-width anchored block.
- **Variants:** grid-card · full-width-block (alternating) · compact (teaser on Home).
- **Properties:** `title`, `intro`, `features[]`, `value`, `media?`, `variant`.
- **States:** default · hover · (optional) expanded/collapsed.
- **Spacing:** strong separation between blocks; internal rhythm for list + value.
- **Typography:** title H3/H4; features Body list; القيمة emphasized (accent).
- **Icons:** optional service icon; list markers.
- **Animations:** reveal on entry; features stagger; القيمة may highlight; optional media mask reveal (Doc 05 §7,§12,§28).
- **Responsive Behaviour:** full-width blocks stack; grids collapse to single column; optional collapse on mobile (never hide from crawlers).
- **Accessibility:** each title a heading; features `<ul>`; expand/collapse accessible if used.
- **RTL Rules:** alternation and alignment mirror.
- **Performance:** lazy-load media across 10 blocks; reveals fire once (Doc 09 Page 3).
- **Developer Notes:** renders from admin data; handle any count (0/1/many) with empty state.
- **Common Mistakes:** 10 blocks blurring together (insufficient separation); non-verbatim content; missing empty state.
- **Definition of Done:** universal DoD + verbatim content, admin-driven, scannable+readable, performant on long page.

---

### 10. Client Card (Logo)

- **Purpose:** Display a client logo as proof (Doc 02 §4.2) — **admin-editable**.
- **Description:** Neutral cell containing a centered logo, consistent aspect, optional name/sector.
- **Variants:** logo-only · logo+name · grayscale→color on hover.
- **Properties:** `logo`, `name`, `sector?`, `href?`.
- **States:** default · hover (grayscale→color / subtle scale).
- **Spacing:** even, generous cells; consistent gutters.
- **Typography:** optional name Small/Medium.
- **Icons:** none (logo is the content).
- **Animations:** staggered fade-in; hover color/scale (Doc 05 §29–30); reduced-motion → static color.
- **Responsive Behaviour:** grid reflows (4–6 → 3–4 → 2–3 per row).
- **Accessibility:** logo `alt` = brand name; sufficient contrast of logo on cell.
- **RTL Rules:** grid flows right-to-left; alignment mirrors.
- **Performance:** prefer SVG logos; optimize raster; lazy-load below fold.
- **Developer Notes:** confirm canonical logo list with client (Doc 02 §4.2 note).
- **Common Mistakes:** inconsistent aspect/sizing; missing alt; broken rows when count is odd; no empty state.
- **Definition of Done:** universal DoD + even grid, alt text, admin-driven, robust empty state.

---

### 11. Statistics (Stat / Counter)

- **Purpose:** Headline proof figures (e.g., "أكثر من 30 علامة تجارية") (Doc 02 §4.1).
- **Description:** Large number + label, animated count-up on view.
- **Variants:** single · group/row · with-accent-underline.
- **Properties:** `value`, `prefix/suffix`, `label`, `animate`.
- **States:** pre-animation (0) · counting · final.
- **Spacing:** generous; figures dominate.
- **Typography:** figure Display/H1 Bold; label Body/Small.
- **Icons:** optional.
- **Animations:** count-up on view, once (Doc 05 §13); optional underline draw; reduced-motion → show final value immediately.
- **Responsive Behaviour:** row → stacked on mobile.
- **Accessibility:** final value present in DOM for AT (not only animated); numerals per locale decision (Doc 07 §2).
- **RTL Rules:** number/label alignment mirror; numeral system consistent.
- **Performance:** `IntersectionObserver`-triggered; lightweight.
- **Developer Notes:** the "30+" is a key trust signal (Doc 09 §11).
- **Common Mistakes:** value only exists as animation (AT can't read); looping; wrong numeral system.
- **Definition of Done:** universal DoD + count-once, AT-readable value, reduced-motion, locale numerals.

---

### 12. Testimonials

- **Purpose:** Client endorsements (Clients page) — **admin-editable**.
- **Description:** Quote + author (+ role/brand), presented as a slider or grid.
- **Variants:** slider/carousel · static grid · single-feature.
- **Properties:** `items[]`, `variant`, `autoplay`, `controls`.
- **States:** default · active slide · hover (pause) · focus.
- **Spacing:** comfortable quote padding; author separated.
- **Typography:** quote Body-L; author Small/Medium.
- **Icons:** quote mark (decorative); prev/next controls (mirrored).
- **Animations:** slide/cross-fade (dur-medium); entrance reveal; pause on hover/focus (Doc 05 §16); reduced-motion → fade + manual only.
- **Responsive Behaviour:** multi → single card swipe on mobile.
- **Accessibility:** controls keyboard-operable; autoplay pausable, not focus-trapping; `aria-live` for slide changes optional; RTL-aware swipe.
- **RTL Rules:** slide direction and controls mirror.
- **Performance:** lazy-load; code-split slider lib.
- **Developer Notes:** handle 0/1/many (single testimonial shouldn't render broken controls); empty state.
- **Common Mistakes:** auto-advance without pause; keyboard trap; non-mirrored swipe.
- **Definition of Done:** universal DoD + accessible controls, pausable, RTL, empty state.

---

### 13. Timeline

- **Purpose:** Optional sequential narrative (e.g., process/journey "من الفكرة إلى السوق").
- **Description:** Ordered steps along a progress line that draws as the user scrolls.
- **Variants:** vertical · horizontal · pinned-scroll.
- **Properties:** `steps[]`, `orientation`, `pinned`.
- **States:** step upcoming · active · complete.
- **Spacing:** consistent step rhythm; clear connectors.
- **Typography:** step title H4; body Body.
- **Icons:** step markers/numbers.
- **Animations:** progress line draws (Bonfire Flame); steps reveal in sequence (Doc 05 §15); reduced-motion → all visible, line static.
- **Responsive Behaviour:** horizontal/pinned → vertical stack on mobile.
- **Accessibility:** ordered list semantics; not reliant on motion to convey order.
- **RTL Rules:** progresses right-to-left; connectors mirror.
- **Performance:** scroll-linked draw optimized; disable pin on mobile/reduced-motion.
- **Developer Notes:** optional in v1; reserved for a future process section.
- **Common Mistakes:** order only conveyed by animation; broken pin on mobile.
- **Definition of Done:** universal DoD + accessible order, RTL, reduced-motion, mobile degrade.

---

### 14. FAQ

- **Purpose:** Pre-answer objections on About, Services, Clients (Doc 02).
- **Description:** A list of question/answer pairs using the Accordion component.
- **Variants:** single-open · multi-open; with-heading.
- **Properties:** `items[{q,a}]`, `mode`.
- **States:** collapsed · expanded (inherits Accordion).
- **Spacing:** comfortable row rhythm; clear question hit area.
- **Typography:** question H4/Body-Medium; answer Body.
- **Icons:** chevron/plus rotates.
- **Animations:** accordion height+fade; items reveal with section (Doc 05 §19–20).
- **Responsive Behaviour:** full-width stack on mobile.
- **Accessibility:** proper button/`aria-expanded`/region association; keyboard operable.
- **RTL Rules:** icon side + alignment mirror.
- **Performance:** animate height carefully or use grid-rows technique; avoid CLS jank.
- **Developer Notes:** verbatim Q/A from Doc 02; questions include warm colloquial phrasing — reproduce exactly.
- **Common Mistakes:** non-verbatim edits; inaccessible toggles; CLS on expand.
- **Definition of Done:** universal DoD + accessible accordion, verbatim content, RTL.

---

### 15. Accordion

- **Purpose:** Generic expand/collapse container (powers FAQ; usable elsewhere).
- **Description:** A header trigger that reveals/hides a content panel.
- **Variants:** single-open · multi-open · bordered · plain.
- **Properties:** `items[]`, `mode`, `defaultOpen`.
- **States:** collapsed · expanding · expanded · collapsing.
- **Spacing:** consistent header padding; content padding.
- **Typography:** header Medium; content Body.
- **Icons:** chevron/plus with rotation.
- **Animations:** height + content fade (dur-base, ease-standard); icon rotate (dur-fast); reduced-motion → instant (Doc 05 §19).
- **Responsive Behaviour:** full-width.
- **Accessibility:** `<button>` header, `aria-expanded`, `aria-controls`, panel `role/region`; keyboard (Enter/Space); focus visible.
- **RTL Rules:** icon and text alignment mirror.
- **Performance:** avoid animating `height:auto` naively; use measured height or grid technique; no CLS beyond intended expand.
- **Developer Notes:** one Accordion powers all disclosure UI.
- **Common Mistakes:** div triggers; missing ARIA; janky height animation.
- **Definition of Done:** universal DoD + ARIA complete, keyboard, smooth height, reduced-motion.

---

### 16. Forms

- **Purpose:** Capture the contact inquiry (Doc 02 §5.4).
- **Description:** A composed set of Fields + SubmitButton with validation and success/failure handling.
- **Variants:** contact form (6 fields) · (future) newsletter/simple.
- **Properties:** `fields[]`, `onSubmit`, `submitLabel`, `status`.
- **States:** idle · validating · submitting · success · error.
- **Spacing:** consistent field gaps; grouped labels above controls.
- **Typography:** labels Small/Medium; inputs Body.
- **Icons:** validation icons; submit icon.
- **Animations:** field reveal stagger; focus transitions; submit loading→success morph; **no error shake** (Doc 05 §18).
- **Responsive Behaviour:** single-column on mobile; two-column pairing optional on desktop.
- **Accessibility:** every field labeled; errors linked + announced; success/failure announced; logical tab order; submit is a real button.
- **RTL Rules:** field/label/icon alignment mirror; select caret mirrors.
- **Performance:** minimal JS; client + server validation; spam protection (Doc 07 §7).
- **Developer Notes:** preserve user input on failure; verbatim field labels (Doc 02 §5.4).
- **Common Mistakes:** placeholder-as-label; lost input on error; color-only errors.
- **Definition of Done:** universal DoD + validates/submits/confirms with success+failure, accessible, AR/EN, input preserved.

---

### 17. Input (text/email/tel)

- **Purpose:** Single-line text entry.
- **Description:** Labeled input with states and validation.
- **Variants:** text · email · tel · with-icon.
- **Properties:** `label`, `type`, `value`, `placeholder`, `error`, `required`, `disabled`.
- **States:** default · focus · filled · error · disabled · readonly.
- **Spacing:** height 48px; padding 12–16px.
- **Typography:** Body; label Small/Medium above.
- **Icons:** optional leading/validation icon.
- **Animations:** focus border→Bonfire Flame + ring (dur-fast); error message fade-in.
- **Responsive Behaviour:** full-width.
- **Accessibility:** persistent visible label; `aria-invalid`/`aria-describedby` for errors; adequate contrast.
- **RTL Rules:** text direction and icon side mirror; `tel`/`email` remain LTR-isolated within RTL flow (bidi).
- **Performance:** trivial.
- **Developer Notes:** never use placeholder as the only label.
- **Common Mistakes:** placeholder-only labeling; missing `aria-invalid`; bidi issues on phone/email.
- **Definition of Done:** universal DoD + labeled, validated, accessible, RTL/bidi correct.

---

### 18. Textarea

- **Purpose:** Multi-line entry (رسالة مختصرة عن المشروع).
- **Description:** Labeled resizable text area.
- **Variants:** default · auto-grow.
- **Properties:** `label`, `rows`, `value`, `error`, `maxLength?`.
- **States:** default · focus · filled · error · disabled.
- **Spacing:** min-height 120px; comfortable padding.
- **Typography:** Body; ≥1.7 line-height for Arabic.
- **Icons:** optional character counter.
- **Animations:** focus transition; auto-grow smooth.
- **Responsive Behaviour:** full-width.
- **Accessibility:** labeled; error handling as Input.
- **RTL Rules:** text direction mirrors; resize handle position acceptable either side.
- **Performance:** trivial.
- **Developer Notes:** if maxLength used, announce remaining count accessibly.
- **Common Mistakes:** too-small default height; no label.
- **Definition of Done:** universal DoD + labeled, accessible, RTL, comfortable sizing.

---

### 19. Dropdown (Select)

- **Purpose:** Choose from options (نوع الخدمة المطلوبة).
- **Description:** Accessible select/combobox with options.
- **Variants:** native select · custom listbox.
- **Properties:** `label`, `options[]`, `value`, `placeholder`, `error`.
- **States:** default · focus · open · selected · error · disabled.
- **Spacing:** matches Input height/padding.
- **Typography:** Body.
- **Icons:** caret (mirrored RTL); check on selected.
- **Animations:** menu open fade/drop (dur-fast); reduced-motion → instant.
- **Responsive Behaviour:** native picker on mobile recommended.
- **Accessibility:** if custom, full listbox ARIA + keyboard (arrows/Enter/ESC/type-ahead); prefer native for reliability.
- **RTL Rules:** caret side, menu alignment, and text mirror.
- **Performance:** custom listbox code-split if heavy.
- **Developer Notes:** service-type options should map to Buyue's services; confirm option list with client.
- **Common Mistakes:** inaccessible custom select; caret not mirrored.
- **Definition of Done:** universal DoD + keyboard/ARIA (or native), RTL, error handling.

---

### 20. Checkbox

- **Purpose:** Boolean/multi-select choice (e.g., consent).
- **Description:** Labeled checkbox with clear states.
- **Variants:** default · indeterminate.
- **Properties:** `label`, `checked`, `indeterminate`, `error`, `disabled`.
- **States:** unchecked · checked · indeterminate · focus · error · disabled.
- **Spacing:** ≥44px hit area including label.
- **Typography:** Body label.
- **Icons:** check/indeterminate glyph.
- **Animations:** check draw/scale (dur-fast); reduced-motion → instant.
- **Responsive Behaviour:** full-width row.
- **Accessibility:** real `<input type=checkbox>`; label associated; focus visible.
- **RTL Rules:** box on the start (right) side; label follows.
- **Performance:** trivial.
- **Developer Notes:** consent/privacy checkbox likely needed on the form — copy is client-supplied, not invented.
- **Common Mistakes:** tiny hit area; unassociated label.
- **Definition of Done:** universal DoD + accessible, ≥44px target, RTL.

---

### 21. Radio Button

- **Purpose:** Single choice from a set.
- **Description:** Grouped radios with one selectable.
- **Variants:** default · card-radio (selectable card).
- **Properties:** `name`, `options[]`, `value`, `error`, `disabled`.
- **States:** unselected · selected · focus · error · disabled.
- **Spacing:** ≥44px targets; consistent group rhythm.
- **Typography:** Body.
- **Icons:** radio dot.
- **Animations:** select transition (dur-fast).
- **Responsive Behaviour:** stack on mobile.
- **Accessibility:** proper radiogroup + arrow-key navigation; group label.
- **RTL Rules:** control on start side; arrow navigation direction mirrors.
- **Performance:** trivial.
- **Developer Notes:** use for any single-choice inputs (e.g., budget range) if added.
- **Common Mistakes:** missing group label; broken keyboard nav.
- **Definition of Done:** universal DoD + radiogroup semantics, keyboard, RTL.

---

### 22. Language Switcher

- **Purpose:** Toggle Arabic ⇄ English (Doc 09 §27–28).
- **Description:** A control switching locale, direction, and content.
- **Variants:** toggle (AR/EN) · dropdown (if more locales later).
- **Properties:** `currentLocale`, `locales[]`, `onChange`.
- **States:** default · active locale · hover/focus.
- **Spacing:** compact; ≥44px target.
- **Typography:** Small/Medium; show both "العربية / English".
- **Icons:** optional globe.
- **Animations:** smooth content fade + mirrored reflow (no jarring jump) (Doc 05 §5).
- **Responsive Behaviour:** in nav on desktop; in mobile menu on small screens.
- **Accessibility:** clear accessible name; announces language change; sets `lang`/`dir`; keyboard operable.
- **RTL Rules:** switching flips entire document direction; persists choice.
- **Performance:** avoid full reload if SPA; otherwise fast localized routes.
- **Developer Notes:** switching must update `hreflang`-correct URL and persist preference.
- **Common Mistakes:** not updating `dir`/`lang`; layout jump; losing scroll position.
- **Definition of Done:** universal DoD + correct dir/lang switch, persisted, accessible, smooth reflow.

---

### 23. Search

- **Purpose:** Optional site search (not required for a 5-page v1; document for scalability — Doc 01 §16).
- **Description:** Input + results panel querying pages/services/FAQs.
- **Variants:** inline · overlay/command-palette.
- **Properties:** `query`, `results[]`, `isOpen`.
- **States:** idle · typing · loading · results · empty · error.
- **Spacing:** comfortable input; result rows ≥44px.
- **Typography:** Body; matched terms may emphasize.
- **Icons:** search/clear.
- **Animations:** overlay fade; results reveal; reduced-motion → instant.
- **Responsive Behaviour:** overlay on mobile.
- **Accessibility:** `role=search`; results as listbox; keyboard nav; announce result count; empty state.
- **RTL Rules:** icon side + alignment mirror.
- **Performance:** debounce queries; lazy-load index.
- **Developer Notes:** likely deferred to a future content-rich phase (blog/case studies).
- **Common Mistakes:** no empty/loading state; inaccessible results.
- **Definition of Done:** universal DoD + all states, accessible results, RTL, debounced.

---

### 24. Pagination

- **Purpose:** Navigate paged content (future: case studies, gallery pages).
- **Description:** Page controls (prev/next + numbers or load-more).
- **Variants:** numbered · prev/next · load-more/infinite.
- **Properties:** `currentPage`, `totalPages`, `onChange`.
- **States:** default · current · disabled (ends) · loading (load-more).
- **Spacing:** ≥44px targets; even spacing.
- **Typography:** Body/Medium.
- **Icons:** prev/next chevrons (mirrored RTL).
- **Animations:** subtle transitions; load-more spinner.
- **Responsive Behaviour:** condense to prev/next on mobile.
- **Accessibility:** `nav` + `aria-current=page`; disabled ends announced; keyboard.
- **RTL Rules:** order and chevrons mirror.
- **Performance:** prefetch adjacent pages optionally.
- **Developer Notes:** for v1's randomized gallery, "load more" is often preferable to numbered pages.
- **Common Mistakes:** non-mirrored chevrons; missing `aria-current`.
- **Definition of Done:** universal DoD + accessible, RTL, all states.

---

### 25. Breadcrumb

- **Purpose:** Secondary wayfinding for nested pages (future: service/case-study detail).
- **Description:** Hierarchical trail of links to the current page.
- **Variants:** default · condensed.
- **Properties:** `items[]`.
- **States:** link default/hover/focus; current (non-link).
- **Spacing:** compact; separators spaced.
- **Typography:** Small.
- **Icons:** separator (chevron/slash) mirrored in RTL.
- **Animations:** none/minimal.
- **Responsive Behaviour:** may collapse middle items on mobile.
- **Accessibility:** `nav` + ordered list; `aria-current=page` on last; separators hidden from AT.
- **RTL Rules:** direction + separators mirror.
- **Performance:** trivial.
- **Developer Notes:** not needed for flat 5-page v1; add with nested pages.
- **Common Mistakes:** last item as a link; separators read by AT.
- **Definition of Done:** universal DoD + semantics, RTL, current marked.

---

### 26. Tabs

- **Purpose:** Switch between related content panels within a section (optional).
- **Description:** Tab list + panels; one active at a time.
- **Variants:** underline · pill · segmented.
- **Properties:** `tabs[]`, `activeTab`, `onChange`.
- **States:** default · active · hover · focus · disabled.
- **Spacing:** comfortable tab padding; ≥44px targets.
- **Typography:** Medium.
- **Icons:** optional per tab.
- **Animations:** active indicator slides (Bonfire Flame); panel cross-fade; reduced-motion → instant.
- **Responsive Behaviour:** scrollable tab strip or → accordion on mobile.
- **Accessibility:** full tablist/tab/tabpanel ARIA; arrow-key nav; focus management.
- **RTL Rules:** order + indicator direction mirror; arrow keys mirror.
- **Performance:** lazy-mount inactive panels if heavy.
- **Developer Notes:** could organize Services by category if desired (optional).
- **Common Mistakes:** missing ARIA; indicator not mirrored.
- **Definition of Done:** universal DoD + ARIA tabs, keyboard, RTL.

---

### 27. Badge

- **Purpose:** Small status/label indicator (e.g., "جديد", sector tag).
- **Description:** Compact pill of text (+ optional icon/dot).
- **Variants:** neutral · accent (Quilt Gold) · primary (Bonfire Flame) · success/warning/danger (derived, Doc 03 §11.5).
- **Properties:** `label`, `variant`, `icon?`.
- **States:** static (usually non-interactive).
- **Spacing:** tight padding; pill radius.
- **Typography:** Overline/Small Medium.
- **Icons:** optional leading dot/icon.
- **Animations:** may fade in with parent.
- **Responsive Behaviour:** inline; wraps gracefully.
- **Accessibility:** if conveying status, ensure text (not color-only); adequate contrast (light badges use dark text).
- **RTL Rules:** icon side mirrors.
- **Performance:** trivial.
- **Developer Notes:** distinct from Tag/Chip (non-interactive label).
- **Common Mistakes:** color-only meaning; low contrast on Quilt Gold/Lime Taffy.
- **Definition of Done:** universal DoD + contrast-safe, RTL.

---

### 28. Tag

- **Purpose:** Categorize content (e.g., gallery categories, sectors).
- **Description:** Label representing a category/attribute; may be filterable.
- **Variants:** static · selectable (filter) · removable.
- **Properties:** `label`, `selected`, `onRemove?`, `onClick?`.
- **States:** default · selected · hover · focus (if interactive).
- **Spacing:** compact; ≥44px if interactive.
- **Typography:** Small Medium.
- **Icons:** optional remove (×).
- **Animations:** select/hover transition.
- **Responsive Behaviour:** wraps in a tag row.
- **Accessibility:** if filter, use button/toggle semantics + `aria-pressed`.
- **RTL Rules:** remove-icon side + wrap direction mirror.
- **Performance:** trivial.
- **Developer Notes:** the 6 gallery categories (Doc 02 §4.3) can drive filter tags.
- **Common Mistakes:** interactive tag without proper semantics.
- **Definition of Done:** universal DoD + correct semantics, RTL.

---

### 29. Chip

- **Purpose:** Compact interactive element (input token, selected filter, quick action).
- **Description:** Rounded interactive element, often with icon + label + optional remove.
- **Variants:** action · filter · input-token · avatar-chip.
- **Properties:** `label`, `icon?`, `onRemove?`, `selected`.
- **States:** default · selected · hover · focus · disabled.
- **Spacing:** ≥44px interactive target.
- **Typography:** Small Medium.
- **Icons:** leading icon; trailing remove.
- **Animations:** select/press feedback; remove fade.
- **Responsive Behaviour:** wraps.
- **Accessibility:** button/toggle semantics; remove has accessible name.
- **RTL Rules:** icon/remove sides mirror.
- **Performance:** trivial.
- **Developer Notes:** distinguish from Tag/Badge by interactivity; use consistently.
- **Common Mistakes:** conflating Chip/Tag/Badge inconsistently.
- **Definition of Done:** universal DoD + interactive semantics, RTL.

---

### 30. Modal (Dialog)

- **Purpose:** Focused overlay for a discrete task/message (e.g., confirmation, lightbox alt).
- **Description:** Centered dialog over a scrim; traps focus.
- **Variants:** default · confirmation · form-in-modal · fullscreen (mobile).
- **Properties:** `isOpen`, `title`, `onClose`, `size`.
- **States:** closed · opening · open · closing.
- **Spacing:** generous padding; clear header/body/footer.
- **Typography:** title H3/H4; body Body.
- **Icons:** close (×).
- **Animations:** scrim fade + dialog scale/rise (dur-base, ease-out-soft); reduced-motion → fade only.
- **Responsive Behaviour:** fullscreen/bottom-sheet on mobile.
- **Accessibility:** `role=dialog` + `aria-modal`; focus trapped + returned; ESC + scrim close; background inert; labelled by title.
- **RTL Rules:** close-icon side + alignment mirror.
- **Performance:** mount on open; lock body scroll (no shift).
- **Developer Notes:** avoid overusing modals; prefer inline where possible.
- **Common Mistakes:** no focus trap/return; unlocked scroll; missing labelling.
- **Definition of Done:** universal DoD + focus trap/return, ESC, inert background, RTL.

---

### 31. Drawer

- **Purpose:** Side/bottom sliding panel (powers Mobile Menu; usable for filters).
- **Description:** Panel sliding from an edge over a scrim.
- **Variants:** start-edge · end-edge · bottom-sheet.
- **Properties:** `isOpen`, `side`, `onClose`.
- **States:** closed · opening · open · closing.
- **Spacing:** comfortable content padding.
- **Typography:** context-dependent.
- **Icons:** close (×); drag handle (bottom-sheet).
- **Animations:** slide + scrim fade (dur-medium); mirror for RTL; reduced-motion → fade.
- **Responsive Behaviour:** common on mobile/tablet.
- **Accessibility:** dialog semantics; focus trap/return; ESC; scroll lock.
- **RTL Rules:** slide side mirrors.
- **Performance:** mount on open; scroll lock without shift.
- **Developer Notes:** shares behavior with Mobile Menu/Modal (build on a common overlay primitive).
- **Common Mistakes:** non-mirrored slide; no focus trap.
- **Definition of Done:** universal DoD + focus trap, scroll lock, RTL slide.

---

### 32. Tooltip

- **Purpose:** Supplementary hint on hover/focus.
- **Description:** Small popover with brief text near a trigger.
- **Variants:** default · with-arrow.
- **Properties:** `content`, `placement`, `trigger`.
- **States:** hidden · visible.
- **Spacing:** compact padding.
- **Typography:** Small.
- **Icons:** optional.
- **Animations:** quick fade (dur-fast); reduced-motion → instant.
- **Responsive Behaviour:** on touch, use tap/long-press or avoid (don't hide essential info in tooltips).
- **Accessibility:** `aria-describedby`; visible on focus (not hover-only); dismissible; non-essential content only.
- **RTL Rules:** placement/arrow mirror.
- **Performance:** trivial; portal to avoid clipping.
- **Developer Notes:** never put essential content in a tooltip (touch users can't hover).
- **Common Mistakes:** hover-only (no focus); essential info hidden.
- **Definition of Done:** universal DoD + focus-triggerable, non-essential, RTL.

---

### 33. Toast (Notification)

- **Purpose:** Transient feedback (e.g., form sent, save success in admin).
- **Description:** Small message appearing briefly, then auto-dismissing.
- **Variants:** success · error · info · warning (derived semantics, Doc 03 §11.5).
- **Properties:** `message`, `variant`, `duration`, `action?`.
- **States:** entering · visible · exiting.
- **Spacing:** compact; icon + text + optional action.
- **Typography:** Body/Small.
- **Icons:** status icon (+ text — never color-only).
- **Animations:** slide/fade in + auto-dismiss; reduced-motion → fade.
- **Responsive Behaviour:** top or bottom, edge-safe on mobile.
- **Accessibility:** `role=status`/`alert` (by severity); `aria-live`; dismissible; not sole channel for critical info.
- **RTL Rules:** enter side + icon side mirror.
- **Performance:** trivial; queue management for multiples.
- **Developer Notes:** use for admin CRUD feedback and form success; pair with inline confirmation where critical.
- **Common Mistakes:** color-only status; too-short duration; not announced to AT.
- **Definition of Done:** universal DoD + live-announced, icon+text, dismissible, RTL.

---

### 34. Gallery

- **Purpose:** Present project imagery on Clients (Doc 02 §4.3) — **admin-editable**, randomized, 6 categories.
- **Description:** Responsive grid/masonry of images with optional filter tags and lightbox.
- **Variants:** grid · masonry · filtered · with-lightbox.
- **Properties:** `images[]`, `categories[]`, `layout`, `lightbox`.
- **States:** default · hover · loading · empty · filtered.
- **Spacing:** consistent gutters; reserved cells.
- **Typography:** captions Small.
- **Icons:** filter tags; lightbox controls.
- **Animations:** mask/scale reveal on entry; hover zoom + caption; filter transitions (Doc 05 §10); reduced-motion → static.
- **Responsive Behaviour:** columns reduce; masonry → simpler grid on mobile; swipeable.
- **Accessibility:** images alt-texted; filter as accessible toggles; lightbox focus-trapped, keyboard (arrows/ESC), captions readable.
- **RTL Rules:** grid flows + lightbox nav mirror.
- **Performance:** **highest-risk for weight** — AVIF/WebP, srcset, lazy-load, blur-up, reserved dimensions (Doc 07 §14–15); virtualize if very large.
- **Developer Notes:** must handle randomization without broken rows; robust empty state (Doc 09 §23).
- **Common Mistakes:** unoptimized images tanking CWV; broken reflow; missing alt/empty state.
- **Definition of Done:** universal DoD + optimized, accessible lightbox, empty state, admin-driven, CWV green.

---

### 35. Image

- **Purpose:** Base responsive image primitive.
- **Description:** Optimized, lazy, dimension-reserved image with brand treatment options.
- **Variants:** plain · rounded · motif-masked · with-overlay/scrim.
- **Properties:** `src/srcset`, `alt`, `sizes`, `ratio`, `loading`, `treatment`.
- **States:** loading (blur-up) · loaded · error (fallback).
- **Spacing:** none intrinsic.
- **Typography:** n/a.
- **Icons:** n/a.
- **Animations:** blur-up resolve; optional reveal (Doc 05 §10).
- **Responsive Behaviour:** `srcset`/`sizes`; art-direction via `<picture>` for hero/gallery.
- **Accessibility:** meaningful `alt`; decorative → empty alt/hidden.
- **RTL Rules:** treatment/mask direction mirror where directional.
- **Performance:** modern formats, correct sizing, lazy below fold, eager for LCP, reserved dimensions (no CLS) (Doc 07 §14).
- **Developer Notes:** client images graded to one consistent look before publish (Doc 03 §20).
- **Common Mistakes:** unsized (CLS); wrong format; missing alt.
- **Definition of Done:** universal DoD + optimized, sized, alt-correct, no CLS.

---

### 36. Video

- **Purpose:** Motion media (e.g., cinematic hero background, campaign reels).
- **Description:** Optimized, controllable video with poster and fallbacks.
- **Variants:** background (muted autoplay loop) · inline-player · thumbnail→lightbox.
- **Properties:** `src`, `poster`, `autoplay`, `muted`, `loop`, `controls`.
- **States:** poster/loading · playing · paused · error.
- **Spacing:** aspect-reserved.
- **Typography:** captions/labels.
- **Icons:** play/pause/mute (accessible).
- **Animations:** subtle scale/parallax for background video; reduced-motion → static poster.
- **Responsive Behaviour:** downgrade to poster image on small/slow devices; art-directed.
- **Accessibility:** captions/transcripts for meaningful audio; controls keyboard-operable; background video is decorative + pausable; respect reduced-motion (no autoplay motion).
- **RTL Rules:** control layout mirrors.
- **Performance:** compress; lazy-load; avoid autoplay on mobile data; poster is LCP-friendly.
- **Developer Notes:** background video must never block LCP or run on reduced-motion.
- **Common Mistakes:** heavy autoplay video killing performance; no reduced-motion fallback; missing captions.
- **Definition of Done:** universal DoD + optimized, captioned where needed, reduced-motion poster, accessible controls.

---

### 37. Section Header

- **Purpose:** Consistent heading block starting each section (Doc 09 §6).
- **Description:** Optional eyebrow/badge + heading + optional subheading/lead.
- **Variants:** default · centered · with-eyebrow · with-cta.
- **Properties:** `eyebrow?`, `heading`, `subheading?`, `align`, `cta?`.
- **States:** static.
- **Spacing:** consistent bottom spacing before section content.
- **Typography:** eyebrow Overline; heading H2 Zarid; subheading Body-L.
- **Icons:** optional eyebrow icon.
- **Animations:** heading mask/line reveal; subheading fade+rise (Doc 05 §12).
- **Responsive Behaviour:** scales; center vs start per variant.
- **Accessibility:** correct heading level; eyebrow not a heading (styled text).
- **RTL Rules:** alignment logical (start = right in RTL).
- **Performance:** trivial.
- **Developer Notes:** enforces the standard section structure everywhere.
- **Common Mistakes:** eyebrow marked as a heading; inconsistent heading levels.
- **Definition of Done:** universal DoD + correct semantics, consistent spacing, RTL.

---

### 38. Footer

- **Purpose:** Global closing region + safety-net navigation/contact (Doc 02 Footer).
- **Description:** Brand mark, condensed nav, contact essentials, social links, parent-group attribution, copyright.
- **Variants:** full · condensed.
- **Properties:** `nav[]`, `contact`, `social[]`, `attribution`, `copyright`.
- **States:** link hover/focus.
- **Spacing:** generous; clear column grouping.
- **Typography:** Body/Small; headings Small Medium.
- **Icons:** social icons; contact icons.
- **Animations:** subtle reveal; link underline hover; back-to-top (Doc 05 §21).
- **Responsive Behaviour:** multi-column → stacked accordion/columns on mobile.
- **Accessibility:** `<footer>` landmark; links accessible; social icons labelled; contact links actionable.
- **RTL Rules:** column order + alignment mirror.
- **Performance:** lightweight.
- **Developer Notes:** footer must not introduce new marketing sentences; copyright/legal is client-supplied (Doc 02 Footer rule); resolve email/domain before publishing (Doc 01 Constraints).
- **Common Mistakes:** invented footer copy; unlabelled social icons; wrong contact details.
- **Definition of Done:** universal DoD + approved content only, actionable contact, AR/EN, RTL.

---

### 39. CTA Section

- **Purpose:** High-impact conversion block before the footer (e.g., جاهز تبني حضور أقوى لعلامتك؟).
- **Description:** Full-bleed color-block section with heading, supporting line, and primary CTA.
- **Variants:** bonfire-flame · black-powder · lime-taffy · with-media.
- **Properties:** `heading`, `body?`, `cta`, `variant`.
- **States:** CTA states.
- **Spacing:** generous; strong separation from prior section so it lands as a moment.
- **Typography:** heading H2 Zarid; on-color reversed text.
- **Icons:** CTA icon (mirrored).
- **Animations:** block reveal + heading mask; CTA emphasis (Doc 05 §7,§28).
- **Responsive Behaviour:** full-width; text/CTA stack on mobile.
- **Accessibility:** on-color contrast verified (white on Bonfire Flame ≥ large-text bar; use dark text on Quilt Gold/Lime Taffy) (Doc 03 §24).
- **RTL Rules:** alignment + CTA icon mirror.
- **Performance:** lightweight; media (if any) optimized.
- **Developer Notes:** uses exact approved CTA copy (Doc 02).
- **Common Mistakes:** low contrast on color block; weak separation; invented copy.
- **Definition of Done:** universal DoD + contrast-safe, verbatim copy, prominent, RTL.

---

### 40. Loading Skeleton

- **Purpose:** Placeholder for async/admin content while loading (Doc 09 §24).
- **Description:** Neutral shimmer shapes matching the eventual content layout.
- **Variants:** card-skeleton · list-skeleton · media-skeleton · text-lines.
- **Properties:** `shape`, `count`, `animated`.
- **States:** loading (only).
- **Spacing:** mirrors final content spacing (prevents CLS).
- **Typography:** n/a (shapes).
- **Icons:** n/a.
- **Animations:** subtle shimmer (opacity/transform); reduced-motion → static muted blocks.
- **Responsive Behaviour:** matches the layout it stands in for.
- **Accessibility:** `aria-busy`/`aria-hidden` appropriately; announce loading state via a live region if meaningful.
- **RTL Rules:** matches content layout, mirrored.
- **Performance:** must reserve exact dimensions to prevent CLS; cheap to render.
- **Developer Notes:** shape must match final content to avoid layout jump on load.
- **Common Mistakes:** skeleton size ≠ content size (CLS); animated shimmer ignoring reduced-motion.
- **Definition of Done:** universal DoD + dimension-accurate (no CLS), reduced-motion, accessible.

---

### 41. Empty State

- **Purpose:** Graceful UI when dynamic content is absent (Doc 09 §23).
- **Description:** Illustration/icon + short message + optional CTA, on-brand.
- **Variants:** no-services · no-clients · no-projects · no-testimonials · no-search-results.
- **Properties:** `illustration/icon`, `message`, `cta?`.
- **States:** static.
- **Spacing:** centered, comfortable.
- **Typography:** message Body/Body-L.
- **Icons:** brand-consistent illustration/icon.
- **Animations:** subtle fade-in.
- **Responsive Behaviour:** centered, full-width.
- **Accessibility:** message readable by AT; CTA accessible.
- **RTL Rules:** alignment + illustration direction mirror.
- **Performance:** trivial.
- **Developer Notes:** message is brand-voiced but must not invent marketing claims (Doc 07 §1); localize AR/EN.
- **Common Mistakes:** blank region instead of empty state; invented copy.
- **Definition of Done:** universal DoD + present for every dynamic region, localized, accessible.

---

### 42. Error State

- **Purpose:** Communicate failures clearly with a recovery path (Doc 09 §25).
- **Description:** Icon + message + retry/next action for form/data/load failures.
- **Variants:** inline (field) · block (section load fail) · form-submit-fail.
- **Properties:** `message`, `retry?`, `severity`.
- **States:** static (on error).
- **Spacing:** clear, adjacent to the failure.
- **Typography:** message Body; error color + icon + text.
- **Icons:** error icon (with text — never color-only).
- **Animations:** fade-in (no shake) (Doc 05 §18).
- **Responsive Behaviour:** full-width; inline near field.
- **Accessibility:** `role=alert`/announced; linked to the field/context; keyboard-reachable retry.
- **RTL Rules:** icon side + alignment mirror.
- **Performance:** trivial.
- **Developer Notes:** never lose user input on form errors (Doc 07 §9); localize.
- **Common Mistakes:** color-only errors; lost input; no retry path.
- **Definition of Done:** universal DoD + announced, icon+text, recovery path, input preserved.

---

### 43. Success State

- **Purpose:** Confirm a completed action (e.g., form submitted).
- **Description:** Positive confirmation (icon + message), possibly replacing the form.
- **Variants:** inline · block · toast.
- **Properties:** `message`, `nextAction?`.
- **States:** static (on success).
- **Spacing:** clear, reassuring.
- **Typography:** message Body/Body-L.
- **Icons:** success check (+ text).
- **Animations:** button→success morph / gentle reveal (Doc 05 §9).
- **Responsive Behaviour:** full-width.
- **Accessibility:** announced (`role=status`); focus moved to confirmation where appropriate.
- **RTL Rules:** icon side + alignment mirror.
- **Performance:** trivial.
- **Developer Notes:** success copy is client-supplied/approved, not invented; localize.
- **Common Mistakes:** silent success; not announced; invented copy.
- **Definition of Done:** universal DoD + clear + announced confirmation, localized.

---

### 44. 404 State (Not Found)

- **Purpose:** Handle unknown routes gracefully (Doc 09 §25, Doc 07 §21).
- **Description:** Branded not-found page with message and routes back to key pages.
- **Variants:** default.
- **Properties:** `message`, `primaryLinks[]`.
- **States:** static.
- **Spacing:** centered, generous, on-brand.
- **Typography:** large heading (Display/H1) + supporting line.
- **Icons:** brand illustration/motif.
- **Animations:** subtle entrance; reduced-motion → static.
- **Responsive Behaviour:** centered, full-width.
- **Accessibility:** proper heading; links accessible; correct `lang`/`dir`.
- **RTL Rules:** alignment + illustration mirror.
- **Performance:** lightweight; correct 404 HTTP status (Doc 07 §21).
- **Developer Notes:** message localized; must not be indexed as valid content; keep on-brand.
- **Common Mistakes:** default host 404; wrong status code; not localized.
- **Definition of Done:** universal DoD + branded, correct 404 status, routes home, localized.

---

## PART C — COMPONENT INVENTORY & CHECKLIST

### Master component checklist (per component before it ships)

- [ ] Purpose & description documented.
- [ ] All variants implemented.
- [ ] All applicable states (default/hover/focus/active/disabled/loading/empty/error/success).
- [ ] Tokenized (colors/space/radius/shadow/type/motion) — no magic numbers.
- [ ] Typography & spacing per Doc 03.
- [ ] Icons consistent + directional icons mirror in RTL.
- [ ] Animations per Doc 05 + reduced-motion fallback.
- [ ] Responsive across mobile/tablet/desktop.
- [ ] Accessible: semantics, keyboard, branded focus, contrast, labels, AT-tested.
- [ ] RTL (default) + LTR both verified.
- [ ] Performance: transform/opacity, no CLS, lazy media, code-split if heavy.
- [ ] Props/variants documented for reuse.
- [ ] Reviewed and approved (Doc 11).

### Component → page usage map

| Component | Primary pages |
|-----------|---------------|
| Navigation, Footer, Language Switcher, Section Header, CTA Section | all |
| Hero | all (variants) |
| Buttons, Button Group | all |
| Feature Card | Home (Why Buyue), About (Values) |
| Service Card, Accordion, FAQ | Services (+ FAQ on About/Clients) |
| Client Card, Statistics, Gallery, Image, Testimonials | Clients |
| Forms, Input, Textarea, Dropdown, Checkbox, Radio, Success/Error State | Contact (+ admin) |
| Modal, Drawer, Mobile Menu, Toast, Tooltip | global/interactive |
| Loading Skeleton, Empty State | dynamic regions (Services/Clients/admin) |
| 404 State | error routing |
| Tabs, Search, Pagination, Breadcrumb, Mega Menu, Timeline, Badge/Tag/Chip, Video | optional/scalability |

---

*End of Document 10 — Component System.*
