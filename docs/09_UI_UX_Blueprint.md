# 09 — UI/UX Blueprint
### Buyue (بيوع) — UX Architecture & Layout Blueprint

> **Purpose:** This document defines *how every page is structured and how the user moves through it.* It is not a visual design document (that is Document 03) and not a motion document (that is Document 05). It is the **layout and experience blueprint** — the skeleton and behavior that the brand system, content, and motion are hung onto. A senior engineer should be able to lay out every page from this document without inventing structure.
>
> **Inheritance:** This blueprint inherits the palette, type, spacing, grid, and container rules from **Doc 03**, the content and section inventory from **Doc 02**, the feel from **Doc 04**, the motion vocabulary from **Doc 05**, and the engineering standard from **Doc 07**. Where those documents already specify a value (e.g., 8px spacing scale, 1200px container, motion tokens), this document *uses* it rather than re-defining it.

---

## PART A — GLOBAL UX & LAYOUT ARCHITECTURE

### 1. UX Philosophy

Buyue's UX philosophy is **"understand before you execute"** applied to the visitor: the interface must understand the visitor's intent before asking anything of them. Three principles govern every screen:

1. **Clarity is the highest form of premium.** A decision-maker who is time-poor and proof-driven (Doc 01 §5) must never be confused about *what this is, why it matters, or what to do next.* Every screen answers those three questions above the fold.
2. **The scroll is a narrative, not a scrollbar.** Each page is a sequenced argument (hook → capability → belief → proof → action). The layout paces that argument; nothing competes for the same beat.
3. **One decision per view.** Each viewport region presents a single dominant focal point and, at most, one primary action paired with one subordinate action. Choice overload is the enemy of conversion.

The experience must feel **calm, confident, and inevitable** — the visitor is guided, never pushed; informed, never overwhelmed.

### 2. User Journey

The macro journey is defined in Doc 01 §8 (Arrival → Orientation → Deep evaluation → Proof → Conversion). This blueprint adds the **micro-journey within a page**, which repeats on every page:

```
ENTER  → the visitor lands mid-intent (from nav, search, or a CTA)
ORIENT → the page header states purpose in one heading + one line
ABSORB → sectioned content delivers the argument in paced beats
TRUST  → proof elements (logos, values, FAQ) de-risk the decision
ACT    → a contextual CTA converts, or routes to the next chapter
EXIT   → footer offers a safety-net set of links + contact
```

Every page must support **entry at any point** (a visitor may land on Services first from search). Therefore each page is self-sufficient: it re-establishes context, offers proof, and provides a path to Contact without depending on the visitor having seen Home.

### 3. Reading Flow

- **Arabic (primary):** reading flows **right-to-left, top-to-bottom.** The primary visual anchor (heading, key image, primary CTA) sits toward the **right** in RTL. The eye enters top-right and sweeps left.
- **English (secondary):** reading flows **left-to-right, top-to-bottom.** Anchors flip to the **left.**
- **Z / F pattern:** desktop hero uses a mirrored-Z scan (heading → supporting line → CTA); content sections use an F-pattern (heading, then scannable rows). In RTL these patterns mirror horizontally.
- **Scannability:** headings, short lead lines, and bulleted feature lists (as the content already provides — e.g., "خدمات بيوع تشمل") let a scanner extract the argument without reading prose.
- **Line length:** body measure stays within ~68–75 characters (Doc 03 §7) so Arabic and English paragraphs remain comfortable.

### 4. Visual Hierarchy

Order of visual dominance on any screen (highest → lowest):

1. **Primary heading** (Display/H1/H2 — Zarid Bold) — the loudest element.
2. **Hero/section key media** or **color block** — carries emotion and draws the eye.
3. **Primary CTA** (Bonfire Flame button) — the action anchor.
4. **Supporting subheading / lead line** — orients.
5. **Body copy & feature lists** — informs.
6. **Secondary CTA / links** — subordinate paths.
7. **Meta, captions, labels** — quietest.

Hierarchy is created by **size, weight, color, and space** — in that priority order — never by decoration. Bonfire Flame is reserved for the single most important accent per view (Doc 03 §11, §24).

### 5. Information Hierarchy

Content is tiered so the essential survives even if nothing else is read:

- **Tier 1 (must land in <5s):** what Buyue is, that it is credible, and how to contact.
- **Tier 2 (scan layer):** service scope, differentiators, client proof.
- **Tier 3 (read layer):** full service detail, philosophy, FAQ answers.
- **Tier 4 (reference layer):** contact details, legal/footer, metadata.

Each page maps its sections to these tiers (see per-page **Content Priority**). Tier 1 always appears above the fold or in the first two sections.

### 6. Section Hierarchy

Every section follows a consistent internal structure so the site reads as one system:

```
[ Eyebrow / badge (optional) ]
[ Section heading  — H2, Zarid ]
[ Section subheading / lead line (optional) ]
[ Section body / grid / cards / list ]
[ Section CTA (optional, contextual) ]
```

- Sections alternate background (Springtime Rain / white / Lime Taffy / occasional Black Powder or Bonfire Flame full-bleed) for editorial rhythm (Doc 03 §12).
- No two adjacent sections share the same strong saturated background.
- Section vertical padding: 96–128px desktop, 56–72px mobile (Doc 03 §5).

### 7. Layout Principles

1. **Grid-anchored:** all content aligns to the 12/8/4-column responsive grid (Doc 03 §6). Nothing floats arbitrarily.
2. **Full-bleed backgrounds, contained content:** color blocks and media may reach the viewport edge; text and interactive content stay within the 1200/1320px container (Doc 03 §7).
3. **Asymmetry with intent:** editorial, asymmetric layouts (image on one side, text on the other) are encouraged — but always grid-aligned and always mirrored for RTL.
4. **Repetition builds rhythm:** repeated section structures and card modules make the site feel systematic and premium (Doc 04 §18).
5. **Space is structural, not leftover:** whitespace is allocated deliberately (see White Space Rules).
6. **One idea per section:** each section makes a single point.

### 8. Content Prioritization

- **Above the fold** carries Tier-1 information only; never bury the value proposition beneath decoration.
- **Progressive disclosure:** detail (full service copy, FAQ answers) is revealed on demand (scroll, accordion) rather than dumped at once.
- **Proof early and often:** client logos and the "30+ brands" stat appear on Home and Clients; differentiators appear on Home and About.
- **CTA proximity:** a path to Contact is never more than one section away from any point on any page.
- When space is constrained (mobile), lower-tier content collapses or moves below higher-tier content — never the reverse.

### 9. Navigation Behaviour

- **Persistent top nav** on all pages: Home · About Us · Our Services · Our Clients · Contact Us, plus a persistent primary CTA (Contact) and the AR/EN language switcher (Doc 01 §12).
- **Scroll behavior:** nav condenses on scroll (height + translucent background with blur); may hide on scroll-down and reveal on scroll-up (Doc 05 §5).
- **Active state:** the current page/section is indicated by an animated Bonfire Flame indicator (Doc 05 §5).
- **RTL:** nav order mirrors — Home sits at the right edge in Arabic; the language switcher and CTA sit at the opposite (left) end.
- **Mobile:** collapses to a hamburger → full-screen/drawer menu sliding from the start edge (right in RTL), with staggered item entrance (Doc 05 §5).
- **Keyboard:** fully operable, logical tab order (RTL-aware), visible focus, skip-to-content link (Doc 07 §5).
- **No dead ends:** every page's nav + footer guarantee onward movement.

### 10. CTA Placement Strategy

- **One primary CTA per view region.** Primary = solid Bonfire Flame; secondary = ghost/outline or text link (Doc 01 §10–11, Doc 03 §15).
- **Placement rhythm:**
  - **Hero:** primary (ابدأ مشروعك معنا) + secondary (استعرض أعمالنا).
  - **Mid-page:** contextual CTA at the end of a section's argument (e.g., شاهد كل الخدمات after the services teaser).
  - **Page end:** a strong closing CTA block before the footer (e.g., جاهز تبني حضور أقوى لعلامتك؟ on Clients).
  - **Persistent:** the nav's Contact CTA is always available.
- **Never** place two equal-weight primary CTAs adjacent.
- CTAs use exact approved labels (Doc 02) — no invented copy.

### 11. Trust-Building Strategy

Trust is engineered deliberately, because the audience is proof-driven (Doc 01 §5):

- **Recognizable logos** (stc, Zain, SNB, Vodafone, Coca-Cola, government bodies) surfaced early and prominently.
- **The "أكثر من 30 علامة تجارية" statistic** as a headline proof point (animated counter, Doc 05 §13).
- **Parent-group anchor:** "إحدى العلامات التشغيلية التابعة لمجموعة نوبل بزنس" repeated as a credibility signal.
- **Values & philosophy** (About) demonstrate thinking, not just doing.
- **FAQs** pre-answer objections on every major page.
- **Real project imagery** (stands, campaigns, events) over generic stock (Doc 03 §20).
- **Consistency and polish** themselves are trust signals — the site proves the agency's craft (Doc 04).

### 12. Conversion Strategy

- **Single conversion goal:** get the visitor to Contact (form submit / direct channel).
- **Funnel design:** every page ends by routing toward Contact; Home and Clients carry explicit closing CTAs.
- **Friction reduction:** the contact form is short (6 fields, Doc 02 §5.4); direct channels (phone, email, social) are offered for those who prefer them; "why contact Buyue" reassures before the form.
- **Micro-commitments:** secondary CTAs (view work, see services) keep low-intent visitors engaged until they're ready.
- **Objection handling:** FAQs remove reasons not to convert.
- **Measurement:** every CTA is instrumented (Doc 07 §7, analytics) so funnel performance is observable.

### 13. White Space Rules

- **Whitespace is a premium signal** (Doc 04 §11) — when uncertain, add space.
- **Section breathing room:** 96–128px desktop / 56–72px mobile between sections (Doc 03 §5).
- **Content grouping:** related elements sit closer; unrelated elements are separated by ≥ one spacing step up.
- **Hero generosity:** the hero gets the most negative space of any section — protect its single focal point.
- **Never crowd:** no element touches the container edge without intent; cards keep 24–32px internal padding (Doc 03 §16).
- **Arabic leading:** ≥1.7 line-height contributes to vertical breathing (Doc 03 §4.4).

### 14. Alignment Rules

- **Logical alignment:** use start/end alignment (not hard left/right) so everything mirrors for RTL (Doc 07 §12).
- **Arabic:** text and headings align to the **right** (start); English aligns **left**.
- **Consistent edges:** content shares consistent grid edges down the page; avoid ragged, arbitrary indents.
- **Optical alignment:** headings, buttons, and icons are balanced by eye where box-alignment looks off (Doc 04 §16).
- **Baseline rhythm:** align type to the 8px vertical rhythm where practical.
- **Centered vs. edge:** hero and short statement sections may center; content-dense sections align to the start edge for scannability.

### 15. Grid Behaviour

- 12 columns desktop, 8 tablet, 4 mobile; 24px gutters desktop, 16px mobile (Doc 03 §6).
- **RTL:** column 1 begins at the right edge; the grid math is identical, only the origin flips.
- **Multi-column → single column** collapse on mobile.
- **Span discipline:** cards and media snap to whole columns; avoid sub-column fractional widths that break rhythm.
- Full-bleed elements break out of the grid deliberately; their inner content returns to the grid.

### 16. Container Rules

- Content container max-width 1200px (desktop), 1320px (wide); fluid margins per breakpoint (Doc 03 §7).
- Long-form Arabic/English paragraphs constrained to ~640–720px measure.
- Full-bleed color blocks and galleries extend edge-to-edge; nested content re-enters the container.
- The page body **never** scrolls horizontally; wide content (galleries, horizontal strips) scrolls within its own container (Doc 07 §4).

### 17. Responsive Behaviour

- **Mobile-first** construction, enhanced upward (Doc 07 §4).
- Breakpoints: mobile ≤640, tablet 641–1024, desktop 1025–1440, wide >1440 (Doc 03 §25).
- Type scales down 10–20% on mobile; body stays ≥16px.
- Multi-column layouts stack; asymmetric editorial layouts become vertical sequences.
- **RTL verified at every breakpoint**, not only desktop (Doc 07 §4).
- Touch targets ≥44×44px; hover-only reveals gain tap equivalents (Doc 05 §30).

### 18. Desktop Experience

- Full editorial expression: asymmetric layouts, large display type, full-bleed media, generous space.
- Multi-column grids (2–3-up cards, side-by-side text/media).
- Hover affordances active (card lift, link underline, image zoom, optional custom cursor per Doc 05 §32).
- Parallax and mask reveals at full richness (within performance budget).
- Sticky condensing nav; persistent CTA.

### 19. Tablet Experience

- Hybrid: often 2-column where desktop is 3-column; reduced side margins.
- Editorial asymmetry preserved where it fits; otherwise simplified toward stacking.
- Touch-first interactions (no reliance on hover); larger tap targets.
- Motion retained but slightly reduced; pinned/horizontal sections evaluated for graceful degradation (Doc 05 §24–25).

### 20. Mobile Experience

- Single-column, vertically-sequenced narrative.
- Condensed nav → drawer menu; persistent or easily-reachable Contact CTA (consider a sticky bottom CTA bar on long pages — confirm with client).
- Reduced section padding; scaled type; larger touch targets.
- Heavy effects (parallax, pinning, horizontal scroll, custom cursor) simplify or disable (Doc 05).
- Images art-directed/cropped for portrait; galleries become swipeable/stacked.
- Performance is most critical here — test on mid-range devices (Doc 07 §6).

### 21. Scroll Experience

- Smooth scroll site-wide, tuned to the benchmark feel (azure.sa, above-limits.com) without hijacking control (Doc 05 §22–23).
- Scroll-**triggered** reveals (fire once) are the default; scroll-**scrubbed** effects (parallax, pinned timeline) used sparingly and disabled on reduced-motion/mobile.
- Momentum feels natural; find-in-page and keyboard scrolling remain intact.
- Back-to-top affordance on long pages (Services, Clients).

### 22. Section Transition Logic

- Sections separate via **background change + the angular "carpet-stripe" motif** as divider/mask, not plain rules (Doc 04 §17, Doc 05 §28).
- Entering a section triggers a fade+rise reveal of its content, staggered for grouped items (Doc 05 §7, §27).
- Adjacent color blocks cross-fade/wipe on transition; a neutral separates two saturated blocks.
- **RTL:** wipe/reveal directions mirror.
- Transitions never cause layout shift (CLS budget, Doc 07 §6).

### 23. Empty State Behaviour

Because Services, Clients (logos, projects, testimonials), and the contact form are dynamic/admin-managed, empty states are designed, not accidental (Doc 07 §10):

- **No services / no clients / no testimonials yet:** show a branded, friendly empty state (short line + optional CTA), never a blank region or broken grid.
- **Gallery with no images:** collapse the gallery gracefully or show a placeholder message; never render empty frames.
- Empty states use brand voice and never invent marketing copy (escalate missing copy to content owner, Doc 07 §1).
- Empty states are keyboard/AT accessible and localized (AR/EN).

### 24. Loading Experience

- **Initial load:** brief branded loader → hero reveal (Doc 05 §3); fonts load with swap + matched fallback to avoid FOUC/CLS.
- **Below-fold:** lazy-load with blur-up placeholders (Doc 05 §10, Doc 07 §15); reserve space to prevent CLS.
- **Async content** (admin data, form submit): show skeletons/spinners; buttons enter loading state without width shift (Doc 05 §9).
- **Perceived performance** prioritized: render Tier-1 content first; defer heavy motion/JS (Doc 07 §6).
- Reduced-motion: loaders become simple fades or are skipped.

### 25. Error State Behaviour

- **Form validation errors:** inline, adjacent to the field, with icon + text (never color alone), announced to AT (Doc 07 §5).
- **Form submission failure:** a clear, reassuring message with a retry path; do not lose the user's input.
- **Broken image / failed media:** graceful fallback (placeholder, alt text), never a broken-image icon.
- **404 / not found:** a branded 404 page (see Doc 10 §"404 State") with nav back to key pages.
- **Admin errors:** clear feedback on failed save/upload; no silent failures (Doc 07 §9).
- All error copy is localized and follows brand voice; no invented legal text.

### 26. Accessibility Behaviour

Full standard in Doc 03 §24 and Doc 07 §5. Layout-specific rules:

- **Logical DOM order** matches visual/reading order in both AR and EN (source order drives AT and keyboard).
- **Heading structure:** one H1 per page, no skipped levels (Doc 07 §13).
- **Landmarks:** header, nav, main, footer regions defined; skip-to-content link.
- **Focus order** follows reading order and mirrors correctly in RTL.
- **Targets** ≥44×44px; visible branded focus rings.
- **Motion** respects `prefers-reduced-motion` (Doc 05 §33).
- **Contrast** rules honored — no small Bonfire-Flame/Quilt-Gold/Lime-Taffy text on light (Doc 03 §24).

### 27. RTL Layout Rules (Arabic — primary)

- Root `dir="rtl" lang="ar"`; **Arabic is the default experience** (Doc 07 §2).
- **Everything mirrors:** grid origin, nav order, alignment, card layouts, form fields/labels, sliders, directional icons, and all directional motion (Doc 07 §2, Doc 05).
- Use **logical CSS properties** (inline-start/inline-end) so mirroring is automatic (Doc 07 §12).
- **No positive letter-spacing on Arabic**; body line-height ≥1.7 (Doc 03 §4.4).
- **Bidi isolation** for embedded Latin/numbers (Buyue, SEO, phone numbers) so sentences don't reorder (Doc 07 §2).
- Numerals (Arabic-Indic vs. Western) applied consistently per client decision (Doc 07 §2).
- Verify RTL at **every breakpoint and in every component** (Doc 07 §4).

### 28. LTR Layout Rules (English — secondary)

- Root `dir="ltr" lang="en"` when English is active.
- Anchors and alignment flip to the left; nav order left-to-right.
- English uses Articulat V3; controlled tracking allowed on overlines only (Doc 03 §4).
- English content is the translated derivative (Doc 08) — same sections, order, hierarchy, and CTA intent as Arabic.
- The language switch transitions smoothly and reflows without a jarring jump (Doc 05 §5).

---

## PART B — PAGE-BY-PAGE BLUEPRINTS

> Each page below follows the required template: Purpose · Goals · Target User · Section Order · Layout Logic · Desktop/Tablet/Mobile Layout · Content Priority · Animation Behaviour · Interaction Behaviour · Spacing Guidelines · Visual Hierarchy · Responsive Notes · Accessibility Notes · SEO Notes · Performance Notes · Definition of Done.
> All content references map to **Doc 02**; all motion to **Doc 05**; all tokens to **Doc 03**.

---

### PAGE 1 — HOME (الصفحة الرئيسية)

**Purpose:** The trailer for Buyue — hook the visitor, communicate positioning instantly, and route them to the right chapter (Services, Clients, or Contact).

**Goals:**
- Land the value proposition and positioning in <5s.
- Surface capability breadth and credibility.
- Drive to a primary conversion (Contact) or micro-commitment (Services/Clients).

**Target User:** All primary audiences (Doc 01 §5), most arriving cold; time-poor, proof-driven decision-makers.

**Section Order (Doc 02 Page 1):**
1. Hero — «نبيع كل شيء إلا الكلام» + body + CTAs (ابدأ مشروعك معنا / استعرض أعمالنا)
2. Services Teaser — خدماتنا + "رحلة علامتك التجارية... من الفكرة إلى السوق" + 9-item list → CTA شاهد كل الخدمات
3. Why Buyue — لماذا تختار بيوع؟ + 4 differentiator cards
4. Clients Teaser — عملاؤنا + logo strip + copy → CTA شاهد عملاءنا
5. (Closing) route to Contact via nav CTA / footer

**Layout Logic:** A descending argument — emotional hook (hero) → rational scope (services) → reasons to believe (why) → proof (clients). Each section is one beat; backgrounds alternate for rhythm.

**Desktop Layout:**
- Hero: full-viewport-height, single focal column; heading dominant, body beneath, CTAs in a row; key media/motif full-bleed behind or beside (asymmetric, mirrored for RTL).
- Services teaser: heading + lead on one side, 9-item list as a 2–3 column feature grid.
- Why Buyue: 4 cards in a 2×2 or 4-up row.
- Clients teaser: horizontal logo grid/strip + supporting copy + CTA.

**Tablet Layout:** Hero remains prominent (may reduce to ~80vh); services list → 2 columns; why-buyue → 2×2; logo grid → 3–4 per row.

**Mobile Layout:** Single column throughout; hero heading scales but stays dominant; CTAs stack (primary above secondary); services list single column; cards stack; logos in a 2–3 per row scrollable/stacked grid.

**Content Priority:** Tier 1 = hero value prop + primary CTA. Tier 2 = services scope, client logos/stat. Tier 3 = differentiator detail. On mobile, hero → services → why → clients order preserved.

**Animation Behaviour:** Hero orchestrated entrance (background scale-settle, headline mask reveal, staggered body + CTAs — Doc 05 §6). Section reveals fade+rise with stagger (§7). Logo strip may subtly animate/marquee (§11, linear only). Counters if a stat is shown (§13).

**Interaction Behaviour:** CTA hovers (lift + icon nudge, mirrored RTL); card hovers (lift + accent); logo hover (grayscale→color, optional); smooth scroll to sections.

**Spacing Guidelines:** Hero gets maximum negative space; sections 96–128px desktop / 56–72px mobile; cards 24–32px padding (Doc 03 §5, §16).

**Visual Hierarchy:** Hero heading > primary CTA > hero media > services heading > differentiator cards > logos. One Bonfire Flame accent per view.

**Responsive Notes:** Verify hero heading doesn't overflow at small widths; CTAs remain ≥44px and reachable; logo grid reflows cleanly; RTL mirrored at all breakpoints.

**Accessibility Notes:** H1 = hero heading; logical order hero→services→why→clients; logos have alt/aria; CTAs are real buttons/links with accessible names; reduced-motion fallbacks.

**SEO Notes:** Ship exact Home title/description/keywords (Doc 02 Page 1). Single H1. LocalBusiness/Organization structured data. LCP target = hero media/heading.

**Performance Notes:** Hero media is the LCP — eager-load and optimize; defer below-fold motion/JS; lazy-load logos/gallery; keep hero within LCP<2.5s (Doc 07 §6).

**Definition of Done:** Meets the shared DoD (Doc 07 §18) + hero lands value prop in <5s, all four sections present with verbatim content, both AR/EN, all breakpoints, motion + reduced-motion verified, CWV green.

---

### PAGE 2 — ABOUT US (من نحن)

**Purpose:** Convert interest into belief — communicate who Buyue is, its philosophy, and the Noble Business Group relationship; make the agency feel thoughtful and trustworthy.

**Goals:**
- Establish credibility and philosophy (understand-before-execute; brands as long-term strategic assets).
- Present vision, mission, values clearly.
- Pre-answer identity/scope objections via FAQ.
- Route to Contact.

**Target User:** Trust-seeking evaluators; procurement/selection committees; enterprise & government buyers (Doc 01 §5).

**Section Order (Doc 02 Page 2):**
1. Intro — من نحن (4 paragraphs)
2. Vision — رؤيتنا
3. Mission — رسالتنا
4. Values — قيمنا (4 value cards)
5. FAQ — أسئلة شائعة عن بيوع (3 Q/A) → CTA تواصل معنا الآن

**Layout Logic:** Statement → aspiration → commitment → principles → reassurance. A calm, editorial read that rewards attention.

**Desktop Layout:** Intro as a lead editorial block (constrained measure). Vision & Mission as two contrasting statement panels (may use Lime Taffy / Black Powder blocks). Values as a 2×2 or 4-up card grid. FAQ as an accordion column with a supporting heading.

**Tablet Layout:** Vision/Mission may stack; values → 2×2; FAQ full-width accordion.

**Mobile Layout:** Single column; statement panels stack full-width; values stack; FAQ accordions stack; CTA prominent at end.

**Content Priority:** Tier 1 = who-we-are intro + parent-group anchor. Tier 2 = vision/mission, values. Tier 3 = FAQ detail.

**Animation Behaviour:** Section fade+rise reveals; values stagger in; statement panels may use mask reveal / background wipe (Doc 05 §7, §28); FAQ accordion height+fade (§19).

**Interaction Behaviour:** Accordion expand/collapse (icon rotate, one-open optional); card hovers; CTA hover.

**Spacing Guidelines:** Generous measure for philosophical copy; clear separation between vision/mission/values; standard section padding.

**Visual Hierarchy:** من نحن heading > intro lead > vision/mission statements > values > FAQ. Values titles (H4) dominate their cards.

**Responsive Notes:** Long Arabic paragraphs must not exceed comfortable measure on wide screens; ensure statement panels retain contrast when stacked.

**Accessibility Notes:** H1 = من نحن; vision/mission/values/FAQ as proper headings; accordion with `aria-expanded`, keyboard operable (Doc 05 §19); contrast on Lime Taffy panels uses Black Powder text (Doc 03 §24).

**SEO Notes:** Ship About title/description/keywords (Doc 02 Page 2); the parent-group and country keywords are important; single H1; consider Organization schema with foundational info.

**Performance Notes:** Mostly text — lightweight; still lazy-load any imagery; keep accordion animations transform/height-optimized (Doc 07 §16).

**Definition of Done:** Shared DoD + all five sections with verbatim content, vision/mission/values legible and on-brand, FAQ accessible, AR/EN, all breakpoints, CTA routes to Contact.

---

### PAGE 3 — OUR SERVICES (خدماتنا)

**Purpose:** Demonstrate the full brand-journey capability — from social/digital to exhibitions and print — and convert capability-interest into a project inquiry.

**Goals:**
- Communicate scope (10 detailed services) without overwhelming.
- Let visitors scan or deep-read as needed (progressive disclosure).
- Pre-answer service/packaging objections.
- Route to Contact (ابدأ مشروعك معنا).

**Target User:** Visitors evaluating specific capabilities; often arriving from search on a specific service (Doc 01 §5, §8).

**Section Order (Doc 02 Page 3):**
1. Intro — خدماتنا + scope statement
2. 10 Service Detail Blocks (each: title + intro + "ماذا نقدم؟"/features + القيمة) — **admin-editable**
3. FAQ — أسئلة شائعة عن خدمات بيوع (3 Q/A) → CTA ابدأ مشروعك معنا

**Layout Logic:** Overview → detailed catalogue → reassurance → convert. The 10 blocks are the page's substance; they must be scannable as a set and readable individually.

**Desktop Layout:**
- Intro: heading + two-paragraph lead.
- Service blocks: consistent modular pattern — options: (a) alternating left/right media+text rows, or (b) a 2-column card grid that expands to detail. Given 10 blocks, recommend **anchored sections** (each block full-width, alternating background) with an optional **sticky service index/nav** on the side for jumping between services.
- "ماذا نقدم؟" lists render as feature lists; القيمة line as an emphasized closing statement (accent).
- FAQ accordion at the end.

**Tablet Layout:** Service blocks stack to single-column full-width; side index becomes a top horizontal chip nav or is removed; feature lists 1–2 columns.

**Mobile Layout:** Single column; each service block stacked (title → intro → features → value); optional collapsible service blocks to reduce scroll length (confirm with client — but never hide content from crawlers, Doc 07 §15). FAQ accordions.

**Content Priority:** Tier 1 = intro scope + that Buyue covers the full journey. Tier 2 = service titles + value lines (scannable). Tier 3 = full feature lists. FAQ Tier 3.

**Animation Behaviour:** Each service block reveals on entry (fade+rise, features stagger — Doc 05 §7, §27); optional mask reveal for block media (§28); القيمة line may highlight (§12); FAQ accordion (§19). Because there are 10 blocks, ensure reveals are performant and fire once.

**Interaction Behaviour:** Optional sticky index highlights current service on scroll; card/media hovers; accordion; CTA hover. Admin-managed content must render cleanly for any count of services (empty/1/many).

**Spacing Guidelines:** Strong separation between service blocks (alternating backgrounds + full section padding) so 10 blocks don't blur together; consistent internal spacing per block.

**Visual Hierarchy:** خدماتنا heading > each service title (H3/H4) > value line accent > feature lists > FAQ. Bonfire Flame accent reserved for القيمة or block CTA.

**Responsive Notes:** Long page — ensure smooth scroll and a back-to-top; verify the sticky index degrades on mobile; RTL mirrors block alternation.

**Accessibility Notes:** H1 = خدماتنا; each service title a proper heading; feature lists as `<ul>`; accordion accessible; sticky index links keyboard-navigable; reduced-motion collapses reveals.

**SEO Notes:** Ship Services title/description/keywords (Doc 02 Page 3) — this page targets high-value service keywords (SEO, social, exhibitions, web, motion). Consider per-service anchors/IDs for deep-linking; Service schema optional.

**Performance Notes:** 10 blocks with media = watch payload — lazy-load all below-fold media, virtualize/stagger reveals, keep INP low despite length (Doc 07 §6, §16).

**Definition of Done:** Shared DoD + all 10 services with verbatim content, admin-editable, scannable + readable, FAQ accessible, long-page scroll performant, AR/EN, all breakpoints, CTA routes to Contact.

---

### PAGE 4 — OUR CLIENTS (عملاؤنا)

**Purpose:** Deliver proof — logos, the 30+ stat, real project imagery, and (admin-managed) testimonials — converting belief into certainty, then into contact.

**Goals:**
- Establish credibility fast via recognizable logos and the headline statistic.
- Show real work across categories.
- Close with a strong CTA (جاهز تبني حضور أقوى لعلامتك؟ → تواصل معنا الآن).
- Pre-answer work/experience objections.

**Target User:** Proof-driven evaluators late in consideration; committees verifying legitimacy (Doc 01 §5).

**Section Order (Doc 02 Page 4):**
1. Intro — عملاؤنا + "أكثر من 30 علامة تجارية" stat + sectors
2. Logo Grid — **admin-editable** (13+ logos)
3. Project Gallery — **admin-editable** (6 categories, randomized)
4. Testimonials — **admin-editable**
5. Final CTA — جاهز تبني حضور أقوى لعلامتك؟ → تواصل معنا الآن
6. FAQ — أسئلة شائعة عن أعمال بيوع (3 Q/A) → CTA احجز استشارة

**Layout Logic:** Claim (stat) → evidence (logos) → demonstration (gallery) → endorsement (testimonials) → convert (CTA) → reassurance (FAQ).

**Desktop Layout:**
- Intro with animated counter for the 30+ stat.
- Logo grid: clean, even grid (simple per requirement — "Grid بسيط") with consistent aspect cells.
- Gallery: randomized masonry/grid of project images across 6 categories; optional lightbox; angular-motif masks (Doc 03 §3, §20).
- Testimonials: carousel/slider or grid.
- Final CTA: full-bleed Bonfire Flame or Black Powder block.
- FAQ accordion.

**Tablet Layout:** Logo grid 3–4 per row; gallery 2–3 columns; testimonials slider; CTA full-width.

**Mobile Layout:** Logos 2–3 per row; gallery single/two column, swipeable; testimonials single-card swipe; CTA prominent; FAQ stacked.

**Content Priority:** Tier 1 = stat + logos. Tier 2 = gallery, final CTA. Tier 3 = testimonials, FAQ.

**Animation Behaviour:** Stat counter on view (Doc 05 §13–14); logos stagger/fade in (§29); gallery images mask/scale reveal + hover zoom (§10); testimonials slider (§16); CTA block reveal; FAQ accordion. All admin-driven content animates regardless of count.

**Interaction Behaviour:** Logo hover (grayscale→color); gallery hover (zoom + caption), click → lightbox; testimonial controls (pause on hover/focus, RTL-aware swipe); CTA hover; accordion.

**Spacing Guidelines:** Logo grid needs even, generous cells; gallery consistent gutters; clear separation before the final CTA so it lands as a moment.

**Visual Hierarchy:** عملاؤنا heading + 30+ stat > logos > gallery > final CTA heading > testimonials > FAQ.

**Responsive Notes:** Randomized gallery must reflow without broken rows; **design robust empty states** for zero logos/projects/testimonials (Doc 09 §23); lightbox and slider must be touch + keyboard accessible.

**Accessibility Notes:** H1 = عملاؤنا; logos alt-texted with brand names; gallery images alt-texted; lightbox focus-trapped and escappable; slider keyboard operable, not auto-trapping; counter shows final value on reduced-motion.

**SEO Notes:** Clients page reinforces authority/keywords; alt text on logos/images aids image SEO; consider not indexing low-value randomized gallery params; keep the 30+ proof visible to crawlers (rendered, not JS-only) (Doc 07 §7).

**Performance Notes:** Image-heavy — this is the highest-risk page for weight. Aggressive optimization: AVIF/WebP, srcset, lazy-load, blur-up, reserved dimensions (Doc 07 §14–15). Gallery must not tank INP/LCP.

**Definition of Done:** Shared DoD + stat animates, logos + gallery + testimonials admin-editable with robust empty states, images optimized, lightbox/slider accessible, final CTA prominent, FAQ accessible, AR/EN, all breakpoints, CWV green despite media load.

---

### PAGE 5 — CONTACT US (تواصل معنا)

**Purpose:** The handshake — convert intent into a submitted inquiry with minimum friction, and offer direct channels for those who prefer them.

**Goals:**
- Make contacting Buyue effortless and reassuring.
- Capture qualified lead data (6-field form).
- Provide direct channels (address, phones, email, social).
- Reassure via "why contact Buyue".

**Target User:** High-intent visitors ready to act; also low-friction seekers who prefer phone/email (Doc 01 §5, §12).

**Section Order (Doc 02 Page 5):**
1. Intro — تواصل معنا + "هل لديك علامة تجارية أو مشروع تسويقي تريد تنفيذه؟"
2. Contact Details — بيانات التواصل (address, phones, email, social)
3. Why Contact Buyue — لماذا تتواصل مع بيوع؟ (4 points)
4. Contact Form — نموذج التواصل (6 fields) → CTA أرسل طلبك الآن

**Layout Logic:** Invite → provide channels → reassure → convert. Reassurance sits next to/above the form to reduce hesitation.

**Desktop Layout:** Two-column layout — details + "why contact" + (optional map) on one side, form on the other (mirrored for RTL). Intro spans the top.

**Tablet Layout:** May remain two-column or stack details above form.

**Mobile Layout:** Single column — intro → why-contact (reassurance) → form → details, or intro → details → form (confirm ordering with client; reassurance-before-form is recommended). Form fields full-width, comfortable tap targets.

**Content Priority:** Tier 1 = form + primary CTA + phone/email. Tier 2 = address, why-contact. Tier 3 = social, map.

**Animation Behaviour:** Section reveal; form fields light stagger on first appearance (Doc 05 §18); field focus transitions; submit → loading → success morph (§9, §18); no shake on error.

**Interaction Behaviour:** Field focus (Bonfire Flame border + ring); inline validation; select for نوع الخدمة المطلوبة (RTL-aware); submit with loading + success/failure states; click-to-call/email on mobile; spam protection (Doc 07 §7).

**Spacing Guidelines:** Comfortable field spacing (label above field, consistent gaps); clear separation between details block and form; generous padding around the form for a calm, low-pressure feel.

**Visual Hierarchy:** تواصل معنا heading > subhead question > form + submit CTA > contact details > why-contact. Submit is the single primary CTA.

**Responsive Notes:** Two-column collapses cleanly; form remains the focal element; ensure keyboard/inputs behave on mobile; RTL mirrors field/label alignment.

**Accessibility Notes:** H1 = تواصل معنا; every field has a persistent visible label (Doc 02 §5.4 labels), errors linked + announced; submit is a real button; success/failure announced to AT; address/phone/email are real, actionable, accessible links (Doc 07 §5).

**SEO Notes:** Ship Contact title/description/keywords (Doc 02 Page 5) — strong local-SEO intent (Khobar/Saudi). Add LocalBusiness structured data with confirmed address/phone/email (resolve the email/domain discrepancy first — Doc 01 Constraints). Embedded map optional.

**Performance Notes:** Lightweight page; if a map is embedded, lazy-load it (defer until interaction); keep form JS minimal; validate client + server side.

**Definition of Done:** Shared DoD + form validates/submits/confirms reliably with success + failure states, direct channels actionable, verbatim content, reassurance present, AR/EN, all breakpoints, accessible, local schema in place (pending client-confirmed contact data).

---

## PART C — ADMIN PANEL UX (Services & Clients)

> Scope per Doc 01 §15 and Doc 07 §10 — admin manages **Services** and **Clients** only.

- **Purpose:** Let non-technical staff add/edit/remove services, client logos, project images, and testimonials without engineering (Doc 01 §9).
- **UX principles:** simple, forgiving, and clearly-stated; every action has feedback (save/upload success/failure — Doc 09 §25); destructive actions confirm before proceeding.
- **Services management:** CRUD on service blocks (title, intro, "ماذا نقدم؟" list, القيمة). Content typed in Arabic remains verbatim on the public site (no auto-editing).
- **Clients management:** CRUD on logos (image + name + optional sector), project images (image + category from the 6 defined + optional caption), and testimonials (quote + author + optional role/brand).
- **Empty/edge states:** the public site must render gracefully for any count (0/1/many) — admin cannot create broken layouts.
- **Accessibility:** the admin UI itself meets keyboard/label standards (Doc 07 §5).
- **Definition of Done:** an admin can complete each CRUD flow end-to-end; changes reflect on the public site; invalid input is prevented with clear messaging.

---

## PART D — GLOBAL DEFINITION OF DONE (UX layer)

A page's UX is Done when, in addition to the shared engineering DoD (Doc 07 §18):

- [ ] Section order matches this blueprint and Doc 02 exactly.
- [ ] Tier-1 content lands above the fold / in the first two sections.
- [ ] One primary CTA per view region; a path to Contact is ≤1 section away everywhere.
- [ ] Reading flow, alignment, and grid mirror correctly in AR (RTL) and EN (LTR).
- [ ] Empty, loading, and error states are designed and accessible.
- [ ] Section transitions and reveals follow Doc 05 with reduced-motion fallbacks.
- [ ] Desktop, tablet, and mobile layouts each match their specified behavior.
- [ ] Trust and conversion elements are present and functional.
- [ ] Verified against Doc 03 (visual), Doc 04 (feel), Doc 05 (motion), Doc 07 (engineering).

---

*End of Document 09 — UI/UX Blueprint.*
