# 07 — Development Rules
### Buyue (بيوع) — Engineering Rulebook & Quality Standards

> **Purpose:** The strict, non-negotiable engineering standard for building the Buyue website. It exists so that any engineer can build a page that is correct, consistent, performant, accessible, bilingual, and maintainable — matching the design and content documents exactly. This is the contract; "Definition of Done" (below) is how we enforce it.

---

## 1. Content Rules

1. **The approved Arabic content (Document 02) is law.** Render it **verbatim** — never paraphrase, shorten, "improve", reword, re-punctuate, or infer missing text.
2. Content lives as **structured data/strings**, not hard-baked into markup in ways that risk silent edits. Every string must be traceable to Document 02.
3. **No lorem ipsum ships.** Any placeholder must be visibly flagged and removed before launch.
4. **Every `⚠ VERIFY` string** in Document 02 must be confirmed against the client's original source file before sign-off.
5. Content owners edit **Services** and **Clients** via the admin panel; engineers do not silently alter admin-managed content.
6. Do not invent copy, legal text, CTAs, or microcopy not present in the approved content. Missing microcopy is escalated to the content owner, not authored by engineering.
7. Preserve exact punctuation, spacing, and Latin tokens (brand names, "SEO", "UGC", etc.) as written.

---

## 2. Arabic Rules

1. **Arabic is the primary language.** The site defaults to Arabic; RTL is the primary layout, not an afterthought.
2. Set correct `lang` and `dir` on the root per active locale (`lang="ar" dir="rtl"` / `lang="en" dir="ltr"`).
3. **Full RTL mirroring:** layout, grid, navigation, icons (directional), form fields, sliders, and animations all mirror for Arabic.
4. **Never apply positive letter-spacing to Arabic** — it breaks glyph joining.
5. Arabic body line-height ≥ 1.7 to accommodate diacritics/stroke height.
6. Use **29LT Zarid** for Arabic (display + text) and **Articulat V3** for Latin; correct fallback stacks defined once, globally.
7. Handle **bidi correctly** — isolate embedded Latin/numbers in Arabic runs so they don't reorder the sentence (use proper bidi isolation).
8. Confirm numeral system (Arabic-Indic vs. Western) with the client and apply **consistently** across the site.
9. Test Arabic rendering across browsers/OSes; verify no tofu (missing glyphs), no clipping of ascenders/descenders, and correct kashida/justification behavior.
10. Never machine-translate or auto-generate Arabic. English is derived from Arabic per Document 08, not the reverse.

---

## 3. Component Rules

1. **Everything is a reusable component.** Every recurring block (nav, hero, service card, feature list, FAQ/accordion, CTA, gallery item, testimonial, footer, form field) is one component, built once.
2. Components are **prop-driven and content-agnostic** — they receive content/data; they don't hardcode it.
3. **Single source of truth** for tokens: colors, spacing, radius, shadows, type, and motion values come from shared design tokens (Doc 03), never magic numbers.
4. Each component must support **both LTR and RTL** without a separate implementation.
5. Each component must define all states: default, hover, focus, active, disabled, loading, empty, error, success (where applicable).
6. Keep components **composable and shallow** — prefer composition over deep, monolithic components.
7. Document each component's props/variants so content owners and other engineers can reuse them.
8. No duplicated one-off variants — extend the shared component instead of copy-pasting.

---

## 4. Responsive Rules

1. **Mobile-first.** Build from the smallest breakpoint up.
2. Breakpoints: mobile ≤640, tablet 641–1024, desktop 1025–1440, wide >1440 (Doc 03).
3. Grid: 12 → 8 → 4 columns; stack multi-column layouts to single column on mobile.
4. Type scales down 10–20% on mobile; body stays ≥16px.
5. Section padding reduces on mobile (~56–72px) per the spacing system.
6. **Verify RTL at every breakpoint** — not only desktop.
7. Wide content (tables, galleries, horizontal strips) scrolls **inside its own container**; the page body must never scroll horizontally.
8. Media uses responsive sizes/art-direction; `max-width:100%`.
9. Sticky nav condenses to a mobile menu; pinned/horizontal-scroll sections degrade gracefully (usually un-pin/stack) on mobile.
10. Test on real mid-range devices, both orientations, both locales.

---

## 5. Accessibility Rules

1. **WCAG 2.1 AA is the minimum bar.**
2. Semantic HTML first (landmarks, headings in order, lists, buttons vs. links used correctly); ARIA only to fill genuine gaps.
3. Contrast: body ≥4.5:1, large text ≥3:1. **Do not** use small Bonfire-Flame/Quilt-Gold/Lime-Taffy text on light backgrounds (Doc 03 §24).
4. **Never convey meaning by color alone** — pair with text/icon (critical since Bonfire Flame doubles as Danger).
5. All interactivity is keyboard-operable; visible branded focus rings; logical tab order (RTL-aware); no keyboard traps; skip-to-content link.
6. Every form field has a persistent visible label; errors announced programmatically and linked to their field.
7. Images have meaningful alt text (bilingual where relevant); decorative images are hidden from AT.
8. Respect `prefers-reduced-motion` (Doc 05 §33); no flashing >3/sec.
9. Accessible names for icon-only buttons and the language switcher.
10. Test with keyboard, a screen reader (in AR and EN), and automated tooling (axe/Lighthouse) — automated checks are necessary but not sufficient.

---

## 6. Performance Rules

1. **Budgets (hard):** Lighthouse Performance ≥90 mobile; **LCP <2.5s, CLS <0.1, INP <200ms**.
2. Animate **transform/opacity only**; 60fps target; no CLS from motion (Doc 05 §34).
3. Images: modern formats (AVIF/WebP), correct sizing/`srcset`, lazy-load below the fold, blur-up placeholders, explicit dimensions to prevent CLS.
4. Fonts: subset (Arabic subsetting matters), `font-display: swap`, preloaded critical faces, matched fallback metrics to reduce shift.
5. Code-split and lazy-load heavy libraries (animation, sliders); defer non-critical JS.
6. Minimize main-thread work; use `IntersectionObserver`/`requestAnimationFrame`; throttle scroll handlers.
7. Cache static assets; use a CDN; compress (gzip/brotli).
8. Ship minimal JS; prefer CSS for what CSS can do (transitions, layout).
9. Pause off-screen animations; remove `will-change` after use.
10. Measure on mid-range mobile and on throttled networks — not just a fast laptop.

---

## 7. SEO Rules

1. Ship the **exact approved title, description, and keywords per page** (Document 02 SEO metadata).
2. One `<h1>` per page; logical heading hierarchy; semantic structure.
3. Correct `lang`/`dir`; provide `hreflang` for AR/EN alternates.
4. Descriptive, human, localized URLs; consistent canonical tags.
5. Open Graph / Twitter card metadata with correct locale and imagery.
6. Structured data (JSON-LD) for Organization/LocalBusiness (Khobar address, contact) — verify details with client (Doc 02 §5.2, plus the domain/email discrepancy to resolve).
7. `sitemap.xml` and `robots.txt`; ensure all 5 pages are crawlable/indexable.
8. Meaningful `alt` text supports image SEO.
9. Fast performance (above) is an SEO factor — keep Core Web Vitals green.
10. Ensure content rendered for crawlers (SSR/SSG or proper hydration) so metadata and copy are indexable.

---

## 8. Animation Rules

1. Reuse the **shared motion tokens** (durations/easings/stagger) from Document 05 — no one-off timings.
2. Default entrance = fade+rise, once, on viewport entry; groups stagger 60–90ms.
3. Mask reveal via the angular motif is the signature premium moment — used consistently.
4. **Mirror all directional motion for RTL.**
5. Transform/opacity only; 60fps; no layout thrash; no CLS.
6. Full `prefers-reduced-motion` fallbacks for every animation.
7. Never break Arabic joining/RTL with glyph-level animation — animate words/lines.
8. Don't hijack scroll or trap the user; smooth-scroll must not break find/keyboard.
9. Pinned/horizontal/parallax effects degrade gracefully on mobile and reduced-motion.
10. If an animation can't hold 60fps on mid-range mobile, simplify or cut it.

---

## 9. Code Quality Expectations

1. **Readable, consistent, self-documenting** code that matches the surrounding style.
2. Enforced linting + formatting (e.g., ESLint/Prettier or project equivalent); no warnings ship.
3. Strong typing where the stack allows; no `any`-style escape hatches without justification.
4. Small, focused functions/components; clear separation of concerns (content, presentation, behavior).
5. No dead code, no commented-out blocks, no `console` noise in production.
6. Meaningful commits; PRs reviewed before merge (see Review Checklist).
7. Handle errors and edge cases explicitly (empty admin data, failed form submit, missing image).
8. No secrets in the repo; environment config via env vars.
9. Dependencies vetted, minimal, and kept current; avoid heavyweight libs for trivial needs.
10. Comments explain *why*, not *what*.

---

## 10. Reusable Components (canonical set)

Build and reuse these (each RTL-aware, tokenized, fully-stated):

- **Layout:** Header/Nav, Footer, Container, Section, Grid.
- **Content:** Hero, Heading/Eyebrow, Prose/Body, FeatureList, StatCounter.
- **Cards:** ServiceCard, ValueCard, ClientLogo, GalleryItem, TestimonialCard.
- **Interactive:** Button (all variants), Link, Accordion/FAQItem, Tabs (if needed), Slider/Carousel, LanguageSwitcher.
- **Forms:** Input, Textarea, Select, Field (label+control+error), Form, SubmitButton, FormSuccess.
- **Feedback:** Loader/Skeleton, EmptyState, ErrorState, Toast.
- **Motion:** Reveal wrapper, Stagger group, Parallax wrapper (all reduced-motion aware).
- **Admin:** ServiceEditor, ClientEditor, TestimonialEditor, LogoUploader.

> A new page is assembled from these — not built from scratch.

---

## 11. Naming Convention

1. **Consistent, descriptive names** across the codebase.
2. Components: `PascalCase` (`ServiceCard`). Files match component names.
3. Variables/functions: `camelCase`; booleans read as predicates (`isLoading`, `hasError`).
4. Constants: `UPPER_SNAKE_CASE`.
5. CSS classes/utilities: follow the project's convention consistently (e.g., BEM or utility framework) — pick one, apply everywhere.
6. Design tokens: semantic names (`color-bonfire-flame`, `space-4`, `radius-md`, `dur-medium`) — never raw hex/px in components.
7. Content keys: locale-namespaced, stable, descriptive (`home.hero.heading`).
8. Assets: kebab-case, descriptive, dimension/variant suffixed where useful.
9. No abbreviations that obscure meaning; no numbered dumps (`Card2`, `temp`, `final`).
10. Same concept = same name everywhere.

---

## 12. Spacing Rules

1. All spacing uses the **8px-based scale tokens** (Doc 03 §5); 4px half-step only for fine tuning.
2. No arbitrary margins/paddings — use tokens.
3. Consistent section rhythm (96–128px desktop / 56–72px mobile).
4. Consistent internal padding for cards, inputs, buttons per Doc 03.
5. Vertical rhythm respects the 8px grid.
6. Avoid margin collapse surprises; prefer a consistent spacing strategy (e.g., gap/owl-selector) applied uniformly.
7. RTL spacing uses logical properties (inline-start/inline-end) so it mirrors automatically.

---

## 13. Typography Consistency

1. Only two families: **29LT Zarid** (Arabic) + **Articulat V3** (Latin). **No third font.**
2. Use the **type scale tokens** (Doc 03 §4.4); no arbitrary font sizes.
3. Weights limited to the defined set (Light/Regular/Medium/Bold).
4. One `<h1>` per page; heading levels never skipped for styling reasons.
5. Line-heights per the scale; Arabic ≥1.7 body.
6. No letter-spacing on Arabic; controlled tracking on Latin overlines only.
7. Consistent measure (line length) for readability (~68–75 chars).
8. Use logical text alignment (start/end) so it mirrors in RTL.

---

## 14. Image Optimization

1. Serve AVIF/WebP with fallbacks; appropriate compression.
2. Provide `srcset`/`sizes` for responsive delivery; art-direct hero/gallery crops.
3. Always set explicit width/height (or aspect-ratio) to prevent CLS.
4. Compress and strip metadata; keep file sizes tight.
5. Client-supplied project/logo images are **color-graded to one consistent look** before publishing (Doc 03 §20).
6. Use a CDN/image pipeline; cache aggressively.
7. Provide meaningful alt text; mark decorative images appropriately.
8. Logos: consistent aspect box, transparent backgrounds, crisp at all sizes (prefer SVG where available).

---

## 15. Lazy Loading

1. Lazy-load all below-the-fold images and media; eager-load only the LCP hero image.
2. Use blur-up/low-quality placeholders that resolve smoothly.
3. Lazy-load/defer heavy scripts (animation libs, sliders, maps).
4. Consider lazy-mounting off-screen heavy components (galleries, testimonial sliders).
5. Never lazy-load content required for the initial paint or SEO-critical content.
6. Ensure lazy loading doesn't cause CLS (reserve space).

---

## 16. Motion Performance

1. Transform/opacity only; GPU-accelerated (`translate3d`), 60fps.
2. `IntersectionObserver` for triggers; `requestAnimationFrame` for scroll-linked; throttle handlers.
3. Pause/disable off-screen and reduced-motion animations.
4. `will-change` sparingly, removed after animation.
5. Lazy-load animation libraries; keep motion JS off the critical path.
6. Budget-guard: motion must not push LCP/INP/CLS past thresholds.
7. Test motion on mid-range mobile; degrade gracefully.

---

## 17. Testing Expectations

1. **Cross-browser:** latest Chrome, Firefox, Safari, Edge.
2. **Cross-device:** mobile/tablet/desktop; iOS Safari + Android Chrome mandatory.
3. **Bilingual:** every page tested in **AR (RTL)** and **EN (LTR)**.
4. **Accessibility:** keyboard-only pass, screen-reader pass (AR + EN), automated axe/Lighthouse.
5. **Performance:** Lighthouse + field/lab Core Web Vitals on mobile.
6. **Functional:** nav, language switch, all CTAs, contact form (validation, submit, success, failure), FAQ accordions, galleries/sliders, admin CRUD for Services & Clients.
7. **Content integrity:** Arabic strings match Document 02 verbatim; `⚠ VERIFY` items confirmed.
8. **Reduced-motion:** verify fallbacks with the OS setting enabled.
9. **Regression:** re-test after content/admin changes.
10. **Visual QA:** against the design specs at each breakpoint, both locales.

---

## 18. Definition of Done

A page/feature is **Done** only when **all** are true:

- [ ] Matches the design spec at every breakpoint, in **AR (RTL)** and **EN (LTR)**.
- [ ] Uses only shared tokens/components (no magic numbers, no one-off duplicates).
- [ ] Arabic content is **verbatim** from Document 02; `⚠ VERIFY` items confirmed; no placeholders.
- [ ] English content follows Document 08 (translated from Arabic, not literal).
- [ ] All component states implemented (default/hover/focus/active/disabled/loading/empty/error/success).
- [ ] Fully keyboard-accessible; WCAG 2.1 AA contrast; branded focus; correct semantics; SR-tested.
- [ ] Motion follows Document 05 (tokens, RTL-mirrored, reduced-motion fallback, 60fps).
- [ ] Performance budget met (LCP<2.5s, CLS<0.1, INP<200ms, Perf≥90 mobile).
- [ ] SEO metadata shipped exactly per Document 02; semantic structure valid.
- [ ] Images optimized, sized, alt-texted, consistently graded.
- [ ] Admin-managed content (Services/Clients) is editable end-to-end where required.
- [ ] Cross-browser/device tested; no console errors; lint/format clean.
- [ ] Code reviewed and approved.

---

## 19. Things Developers Must Never Do

1. **Never** edit, paraphrase, shorten, or "improve" the approved Arabic content.
2. **Never** invent copy, CTAs, legal/footer text, or microcopy.
3. **Never** ship an unresolved `⚠ VERIFY` string or lorem ipsum.
4. **Never** hardcode colors/spacing/type/motion values — always use tokens.
5. **Never** treat RTL as an afterthought or ship a page untested in Arabic.
6. **Never** letter-space Arabic or break glyph joining/bidi.
7. **Never** use color as the only signal for meaning (esp. errors).
8. **Never** animate layout properties or ship motion that causes CLS / drops below 60fps.
9. **Never** ignore `prefers-reduced-motion` or accessibility requirements.
10. **Never** add a third font, reassign brand color roles, or distort the logo.
11. **Never** let the page body scroll horizontally.
12. **Never** commit secrets or ship with console noise/dead code.
13. **Never** guess the email/domain or phone numbers — use the client-confirmed values (Doc 01 Constraints).
14. **Never** copy a reference site's design pixel-for-pixel — adapt feel into Buyue's system.

---

## 20. Review Checklist (per PR)

- [ ] Scope is focused; PR does one thing well.
- [ ] Reuses shared components/tokens; no duplication or magic numbers.
- [ ] AR (RTL) + EN (LTR) both verified.
- [ ] Content verbatim; no invented strings; `⚠ VERIFY` respected.
- [ ] Accessibility: semantics, keyboard, focus, contrast, labels, alt.
- [ ] Motion: tokens, RTL mirror, reduced-motion, performance.
- [ ] Performance: no CLS, images optimized, no heavy blocking JS.
- [ ] SEO metadata correct.
- [ ] All states handled; edge cases (empty admin data, failed submit) covered.
- [ ] Lint/format clean; no console errors; typed.
- [ ] Tests updated/passing; manual QA notes included.
- [ ] Naming conventions followed.

---

## 21. Quality Assurance Checklist (pre-launch)

**Content & language**
- [ ] Every Arabic string matches Document 02 verbatim (Arabic-literate reviewer sign-off).
- [ ] All `⚠ VERIFY` items confirmed against the client's original file.
- [ ] English mirrors Arabic per Document 08; hierarchy/CTA intent preserved.
- [ ] Email/domain and phone numbers confirmed with client and consistent site-wide.

**Design & brand**
- [ ] Colors, fonts, spacing, radius, shadows match Document 03 exactly.
- [ ] Logo usage correct; motif and photography treatment consistent.

**Bilingual & responsive**
- [ ] All 5 pages correct in AR (RTL) and EN (LTR), all breakpoints.
- [ ] No horizontal body scroll; wide content scrolls in-container.

**Motion**
- [ ] Motion matches Document 05; benchmarked feel; reduced-motion fallbacks verified.

**Accessibility**
- [ ] WCAG 2.1 AA passes; keyboard + screen-reader (AR/EN) passes; branded focus everywhere.

**Performance & SEO**
- [ ] Core Web Vitals green on mobile; Perf ≥90.
- [ ] Titles/descriptions/keywords per page; sitemap/robots; structured data; hreflang.

**Functional**
- [ ] Nav, language switch, all CTAs, FAQ accordions, galleries, sliders work.
- [ ] Contact form: validation, submit, success, failure, spam protection.
- [ ] Admin panel: add/edit/remove Services; add/edit logos, projects, testimonials for Clients.

**Cross-platform**
- [ ] Chrome/Firefox/Safari/Edge; iOS Safari; Android Chrome — all pass.

**Launch readiness**
- [ ] No console errors; analytics configured; 404/error pages designed; favicon/OG images set; SSL/redirects correct.

---

*End of Document 07 — Development Rules.*
