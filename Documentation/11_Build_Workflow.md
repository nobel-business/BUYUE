# 11 — Build Workflow
### Buyue (بيوع) — Implementation Workflow & Delivery Process

> **Purpose:** This document controls **how** the Buyue website is built. It is the process contract: the website is never built all at once. It is delivered in **sequential, review-gated phases** — one section at a time — where each section must pass a full battery of reviews and be **approved** before the next begins. This guarantees that quality, consistency, accessibility, RTL parity, and performance are verified continuously, not discovered at the end.
>
> **Inheritance:** This workflow enforces the standards defined across the package — content (Doc 02), brand (Doc 03), creative feel (Doc 04), motion (Doc 05), engineering rules & DoD (Doc 07), UX blueprint (Doc 09), and components (Doc 10). It does not restate those standards; it *gates against them*.

---

## PART A — GOVERNING PRINCIPLES

### 1. Project Rules

1. **Never build the whole site at once.** Build in phases; ship section by section behind reviews and approvals.
2. **No phase begins until the previous phase is approved.** Approval is explicit and recorded, not assumed.
3. **The Global Design System precedes all sections.** No section is built before tokens and core components exist (Doc 03, Doc 10).
4. **Content is sacred.** Arabic renders verbatim (Doc 02); no invented copy; `⚠ VERIFY` items resolved before the relevant section is approved.
5. **Every section is bilingual + bidirectional from day one** — never "add RTL later" (Doc 07 §2, Doc 09 §27).
6. **Reuse over rebuild.** Sections are assembled from shared components (Doc 10); no page-local forks.
7. **Reviews are mandatory and comprehensive** (15 review dimensions, §12). A section is not "done" until all pass.
8. **Quality gates are hard gates** (§14) — failing any blocks progression.
9. **Definition of Done is non-negotiable** — the shared DoD (Doc 07 §18) plus UX DoD (Doc 09 Part D) plus component DoD (Doc 10) all apply.
10. **Nothing ships that contradicts a prior document.** The documentation package is the single source of truth.

### 2. Implementation Strategy

- **Vertical slices, sequenced:** deliver a fully-finished section (all states, both locales, all breakpoints, motion, a11y, perf) before starting the next — rather than horizontally roughing out all pages.
- **Foundation-first:** setup → design system → navigation → then sections in narrative order (Hero → About → Services → Clients → Contact) → global assembly → final polish.
- **Component-driven:** each new section should mostly *compose existing components*; any genuinely new component is added to Doc 10's library (with its own DoD) before use.
- **Continuous verification:** reviews run per section, so defects are caught small and early.
- **Progressive integration:** as sections are approved, they integrate into the full page flow with cross-section consistency checks.

### 3. Development Philosophy

- **Quality over speed; consistency over cleverness.** A slower, consistent build beats a fast, divergent one.
- **Mobile-first, RTL-first, accessible-first, performance-first** — these are constraints, not afterthoughts.
- **Small, reviewable increments** (Doc 07 §9, §20) — focused PRs, clear scope.
- **Tokens and components are the law** — no magic numbers, no duplication (Doc 07 §3, §11).
- **Self-verifying work** — the builder runs the review checklists before requesting review; reviewers confirm, not discover.
- **Document as you go** — new components/patterns are documented in the system, keeping the package the source of truth.

### 4. Review Philosophy

- **Reviews are structured and multi-dimensional** — 15 named dimensions (§12), not a single subjective glance.
- **Reviews are adversarial-but-constructive** — the reviewer's job is to find what's wrong against the documented standard, then help resolve it.
- **Evidence-based** — reviews reference the specific document/rule a finding violates (e.g., "fails Doc 03 §24 contrast").
- **Blocking vs. non-blocking** — blocking issues (a11y, RTL breakage, content edits, CLS, contrast) must be fixed before approval; minor polish may be logged for the Final Polish Phase *only if it does not violate a hard gate*.
- **Reviews are recorded** — outcomes and sign-offs are tracked so approval is auditable.

### 5. Approval Process

1. **Builder self-checks** against the section DoD and all 15 review dimensions; fixes obvious issues.
2. **Builder requests review**, providing: what was built, in which locales/breakpoints, known limitations, and a self-review note.
3. **Reviewers run the 15 dimensions** (§12); each returns pass / fail-with-findings.
4. **Findings are resolved**; re-review the failed dimensions.
5. **All dimensions pass → Quality Gates checked** (§14).
6. **Approver (design + engineering lead) signs off** — explicit, recorded approval.
7. **Only then** does the next phase begin.

> Approval requires **all** reviews passing **and** all quality gates green. Partial approval does not exist.

### 6. Iteration Process

- Each section may cycle **build → review → fix → re-review** as many times as needed to pass — this is expected, not a failure.
- Iterations are scoped to the review findings; scope creep is avoided.
- If a finding reveals a systemic issue (e.g., a token gap, a component defect), fix it **at the system level** (Doc 03/Doc 10), then propagate — don't patch locally.
- Design/UX changes discovered mid-build route back through the relevant document owner so the source of truth stays accurate (no undocumented divergence).
- Regressions in previously-approved sections caused by a system change trigger a targeted re-review of those sections.

---

## PART B — THE PHASED BUILD

> The build proceeds strictly in the order below. **Review → Approval** gates appear after every section from Phase 3 onward. No exceptions.

### 7. Phase Sequence (authoritative order)

```
PHASE 1  Project Setup
   │
PHASE 2  Global Design System
   │
PHASE 3  Navigation ───────────► Review ─► Approval
   │
PHASE 4  Hero ─────────────────► Review ─► Approval
   │
PHASE 5  About (من نحن) ────────► Review ─► Approval
   │
PHASE 6  Services (خدماتنا) ────► Review ─► Approval
   │
PHASE 7  Clients (عملاؤنا) ─────► Review ─► Approval
   │
PHASE 8  Contact (تواصل معنا) ──► Review ─► Approval
   │
PHASE 9  Admin Panel (Services & Clients) ─► Review ─► Approval
   │
PHASE 10 Global Assembly & Cross-Section Consistency ─► Review ─► Approval
   │
PHASE 11 Final Polish Phase ───► Full QA ─► Approval
   │
PHASE 12 Deployment ───────────► Launch ─► Post-launch
```

> Continue the Review → Approval discipline until **every** section is completed and approved. A phase that fails review does not advance; it iterates (§6) until it passes.

---

### Phase 1 — Project Setup

**Goal:** Establish the technical foundation before any UI.
**Scope:**
- Repository, branching model, PR workflow, code review process (Doc 07 §9, §20).
- Tooling: linting, formatting, type-checking, CI (build/lint/test on every PR).
- Project structure for components, tokens, content (bilingual), and pages.
- Content pipeline: approved Arabic strings loaded as structured, traceable data (Doc 07 §1); English slots wired (Doc 08).
- i18n/RTL foundation: `lang`/`dir` handling, logical-property CSS baseline, locale routing/hreflang.
- Font loading (29LT Zarid, Articulat V3) with `font-display: swap` + matched fallbacks (Doc 05 §3, Doc 07 §6); **confirm licensing** (Doc 01 Assumptions).
- Performance/accessibility budgets configured in CI where possible (Lighthouse/axe).
- Analytics and error monitoring scaffolding.
**Exit criteria:** clean CI pipeline; empty app builds and serves in AR (RTL) and EN (LTR); fonts load without FOUC; budgets wired.

---

### Phase 2 — Global Design System

**Goal:** Build the tokens and core components everything depends on (Doc 03, Doc 10) — **before** any section.
**Scope:**
- **Design tokens:** colors (Bonfire Flame/Black Powder/Quilt Gold/Springtime Rain/Lime Taffy), spacing (8px scale), radius, shadows, type scale, motion tokens (durations/easings/stagger) — all from Doc 03/Doc 05.
- **Theme:** light + dark themes; on-color variants; RTL/LTR via logical properties.
- **Core primitives:** Container, Section, Grid, Section Header, Button/Button Group, Card base, Image, Link, Icon system, Loading Skeleton, Empty/Error/Success State, Toast, Modal/Drawer overlay primitive.
- **Motion utilities:** Reveal wrapper, Stagger group, Parallax wrapper — all reduced-motion aware (Doc 05).
- Component documentation stubs aligned to Doc 10.
**Exit criteria:** tokens usable everywhere; primitives pass component DoD (Doc 10 §10) in AR/EN, all states, reduced-motion; a component sandbox/storybook demonstrates them.
**Gate:** the design system is reviewed (a subset of the 15 dimensions: UI, Typography, Spacing, Accessibility, RTL, Motion, Performance, Consistency, Code) and **approved** before Phase 3.

---

### Phase 3 — Navigation → Review → Approval

**Goal:** Global Navigation (Header) + Mobile Menu + Language Switcher + Footer skeleton (Doc 10 §1,§3,§22,§38; Doc 09 §9).
**Scope:** persistent nav, scroll-condense/hide-reveal, active indicator, mobile drawer, language switch (dir/lang/persist), skip-to-content, footer structure (approved content only).
**Reviews:** all 15 dimensions (§12).
**Approval:** required before Phase 4.

---

### Phase 4 — Hero → Review → Approval

**Goal:** The Home hero (Doc 10 §4; Doc 09 Page 1) — «نبيع كل شيء إلا الكلام», body, dual CTAs, orchestrated entrance, LCP-optimized media.
**Scope:** hero variant system (also usable as page-headers), reveal choreography, reduced-motion fallback, RTL mirror, LCP budget.
**Reviews:** all 15 dimensions. Special attention: Motion, Performance (LCP), Typography (Arabic display), Content (verbatim heading).
**Approval:** required before Phase 5.

---

### Phase 5 — About (من نحن) → Review → Approval

**Goal:** About page sections (Doc 09 Page 2): intro, vision, mission, values (Feature Cards), FAQ (Accordion), CTA.
**Scope:** statement panels, values grid, accessible FAQ, verbatim content (incl. `⚠ VERIFY` resolution for About paragraphs).
**Reviews:** all 15 dimensions. Special attention: Content, Accessibility (accordion), Typography (long Arabic prose), Consistency.
**Approval:** required before Phase 6.

---

### Phase 6 — Services (خدماتنا) → Review → Approval

**Goal:** Services page (Doc 09 Page 3): intro, 10 Service Cards/blocks, FAQ, CTA; consumes admin data model (built out in Phase 9).
**Scope:** 10 blocks with scannable+readable structure, feature lists, القيمة emphasis, optional service index, long-page scroll performance, empty/any-count handling.
**Reviews:** all 15 dimensions. Special attention: Performance (long page/media), Consistency (10 blocks not blurring), Content (verbatim, `⚠ VERIFY` for web-services block), Motion (fire-once reveals).
**Approval:** required before Phase 7.

---

### Phase 7 — Clients (عملاؤنا) → Review → Approval

**Goal:** Clients page (Doc 09 Page 4): intro + 30+ Statistic, logo grid (Client Cards), project Gallery, Testimonials, final CTA Section, FAQ.
**Scope:** animated counter, even logo grid, optimized randomized gallery + lightbox, testimonial slider, robust empty states, admin data consumption.
**Reviews:** all 15 dimensions. Special attention: Performance (image-heavy — highest risk), Accessibility (lightbox/slider), RTL (gallery/slider), Empty states.
**Approval:** required before Phase 8.

---

### Phase 8 — Contact (تواصل معنا) → Review → Approval

**Goal:** Contact page (Doc 09 Page 5): intro, contact details, why-contact, contact Form (6 fields) with validation + success/failure.
**Scope:** accessible form (labels, errors, submit states), direct channels (actionable phone/email/social), local schema (pending confirmed contact data — resolve email/domain + phone, Doc 01 Constraints), spam protection.
**Reviews:** all 15 dimensions. Special attention: Accessibility (forms), Content (verbatim labels), SEO (local schema), Consistency.
**Approval:** required before Phase 9.

---

### Phase 9 — Admin Panel (Services & Clients) → Review → Approval

**Goal:** The admin CRUD for Services and Clients (Doc 01 §9,§15; Doc 09 Part C; Doc 07 §10).
**Scope:** manage services (title/intro/features/value), client logos (image/name/sector), project images (image/category/caption), testimonials (quote/author/role). Feedback on save/upload (Toast), validation, confirmation on destructive actions, accessible admin UI.
**Reviews:** all 15 dimensions (admin context). Special attention: Content integrity (verbatim Arabic preserved), Accessibility, Error/Empty handling, Consistency with public rendering.
**Approval:** required before Phase 10.

---

### Phase 10 — Global Assembly & Cross-Section Consistency → Review → Approval

**Goal:** Integrate all approved sections into the full, navigable, bilingual site and verify cross-section coherence.
**Scope:** end-to-end navigation and language switching; page transitions (Doc 05 §4); consistent section rhythm/backgrounds across pages; footer finalized (approved copy, confirmed contact); sitemap/robots/hreflang; 404 route; analytics wired.
**Reviews:** all 15 dimensions at the whole-site level, with emphasis on **Consistency**, **Cross-browser**, **Responsive**, **RTL**, **Performance**.
**Approval:** required before Phase 11.

---

## PART C — REVIEWS & GATES

### 12. Mandatory Reviews (run after every completed section)

Every section (Phase 3+) must pass **all 15** review dimensions. Each references the governing document.

| # | Review | Checks against |
|---|--------|----------------|
| 1 | **UI Review** | Visual fidelity to the design system (Doc 03), creative feel (Doc 04) |
| 2 | **UX Review** | Structure, flow, hierarchy, CTA/trust/conversion logic (Doc 09) |
| 3 | **Animation Review** | Motion matches vocabulary, tokens, choreography (Doc 05) |
| 4 | **Accessibility Review** | WCAG 2.1 AA, keyboard, AT (AR/EN), focus, contrast (Doc 03 §24, Doc 07 §5) |
| 5 | **Responsive Review** | Mobile/tablet/desktop behavior, no horizontal body scroll (Doc 07 §4, Doc 09) |
| 6 | **RTL Review** | Full mirroring, bidi, no letter-spaced Arabic, logical props (Doc 07 §2) |
| 7 | **Performance Review** | LCP/CLS/INP budgets, image/motion perf, 60fps (Doc 07 §6, Doc 05 §34) |
| 8 | **Typography Review** | Scale, weights, Arabic leading, two-family rule (Doc 03 §4, Doc 07 §13) |
| 9 | **Spacing Review** | 8px system, section rhythm, whitespace (Doc 03 §5, Doc 09 §13) |
| 10 | **Content Review** | Arabic verbatim, `⚠ VERIFY` resolved, no invented copy (Doc 02, Doc 07 §1) |
| 11 | **Consistency Review** | Token/component reuse, no forks, cross-section coherence (Doc 07 §3, Doc 10) |
| 12 | **Code Review** | Quality, naming, states, edge cases, no magic numbers (Doc 07 §9,§11,§20) |
| 13 | **SEO Review** | Metadata per Doc 02, semantics, structured data, hreflang (Doc 07 §7) |
| 14 | **Motion Review** | Reduced-motion fallbacks, purposeful motion, no CLS from animation (Doc 05 §33) |
| 15 | **Cross-browser Review** | Chrome/Firefox/Safari/Edge + iOS Safari + Android Chrome, AR/EN (Doc 07 §17) |

> Reviews 3 (Animation) and 14 (Motion) are distinct: **Animation Review** verifies the motion *design/choreography* matches Doc 05's vocabulary; **Motion Review** verifies motion *safety* — reduced-motion fallbacks, performance, and no-CLS.

### 13. Testing Gates (run per section + before phase exit)

- **Automated:** lint, format, type-check, unit/component tests, axe accessibility scan, Lighthouse (perf/a11y/SEO) — green in CI.
- **Manual functional:** all interactive behaviors for the section (nav, CTA, form, accordion, gallery, slider, admin CRUD) verified.
- **Bilingual:** section tested in AR (RTL) and EN (LTR).
- **Reduced-motion:** verified with OS setting enabled.
- **Cross-device/browser:** matrix from Doc 07 §17.
- **Regression:** previously-approved sections re-checked if a shared component/token changed.

### 14. Quality Gates (hard — all must pass before the next phase)

A phase **cannot** advance unless **all** are green:

- [ ] **G1 — Content integrity:** Arabic verbatim; all in-scope `⚠ VERIFY` resolved; no invented copy.
- [ ] **G2 — Accessibility:** WCAG 2.1 AA; keyboard + AT (AR/EN); branded focus; contrast rules honored.
- [ ] **G3 — RTL/LTR parity:** full mirroring; bidi correct; verified at every breakpoint.
- [ ] **G4 — Responsive:** correct on mobile/tablet/desktop; no horizontal body scroll.
- [ ] **G5 — Performance:** LCP<2.5s, CLS<0.1, INP<200ms, Perf≥90 mobile; 60fps motion.
- [ ] **G6 — Motion safety:** reduced-motion fallbacks; no CLS from animation.
- [ ] **G7 — Consistency:** tokens/components reused; no forks/magic numbers.
- [ ] **G8 — SEO:** metadata + semantics + structured data + hreflang correct for the section.
- [ ] **G9 — Code quality:** lint/type clean; states + edge cases handled; reviewed.
- [ ] **G10 — Cross-browser:** passes the full matrix.
- [ ] **G11 — DoD:** shared (Doc 07 §18) + UX (Doc 09 Part D) + component (Doc 10) DoD satisfied.
- [ ] **G12 — Approval recorded:** design + engineering lead sign-off logged.

> Any red gate blocks progression. Fix, re-review the affected dimensions, re-check gates.

---

## PART D — FINAL POLISH PHASE (Phase 11)

> Runs only after every section is individually approved and the site is assembled (Phase 10). This is the whole-site elevation-and-hardening pass.

### 15. Visual Polish
- Whole-site visual consistency sweep: alignment, optical balance, color-role adherence, image grading uniformity (Doc 03/Doc 04).
- Verify no orphaned styles, inconsistent radii/shadows, or off-token values.

### 16. Animation Polish
- Tune timing/easing across sections for one coherent motion feel (benchmarked to Doc 06 references).
- Ensure choreography consistency (same reveal/stagger vocabulary everywhere).

### 17. Micro-interaction Polish
- Refine hover/focus/press feedback, cursor behavior, form transitions, toggles — the details that read as premium (Doc 04 §16–17).

### 18. Responsive Polish
- Edge-case breakpoints, long-Arabic-string overflow, tablet in-between states, orientation changes; final RTL sweep at every breakpoint.

### 19. Accessibility Polish
- Full keyboard walkthrough (AR/EN); screen-reader passes; focus order; contrast re-audit; reduced-motion re-verification; final axe/manual audit (Doc 07 §5).

### 20. Performance Optimization
- Bundle/code-split audit; image pipeline re-check; font subsetting; remove unused CSS/JS; Core Web Vitals field/lab re-measurement on mid-range mobile (Doc 07 §6).

### 21. SEO Optimization
- Final metadata/title/description/keywords per page (Doc 02); structured data validation; sitemap/robots/canonical/hreflang; OG/Twitter cards; crawlability of rendered content.

### 22. Code Cleanup
- Remove dead code/console/TODOs; finalize naming; ensure documentation matches implementation; dependency audit (Doc 07 §9).

### 23. Component Audit
- Verify every UI element uses a documented component (Doc 10); no undocumented one-offs; all components meet their DoD; storybook/sandbox current.

### 24. Design Consistency Audit
- Cross-page consistency of spacing rhythm, type scale, color roles, motion, and imagery; confirm no document contradictions crept in.

### 25. Cross-browser Testing
- Full matrix (Doc 07 §17) in AR/EN: Chrome, Firefox, Safari, Edge, iOS Safari, Android Chrome.

### 26. Mobile Testing
- Real mid-range devices; touch targets; gestures; performance; sticky/mobile CTA behavior; gallery/slider swipe; form input behavior.

### 27. Final QA
- Full pre-launch QA checklist (Doc 07 §21) executed end-to-end; all quality gates green site-wide; all `⚠ VERIFY` items resolved; email/domain + phone confirmed (Doc 01 Constraints); logo list confirmed; numeral system confirmed.

---

## PART E — DEPLOYMENT & POST-LAUNCH (Phase 12)

### 28. Launch Checklist (pre-deploy)

- [ ] All phases approved; Final Polish complete; all quality gates green site-wide.
- [ ] All approved Arabic content verbatim; English per Doc 08; contact data confirmed (email/domain/phones).
- [ ] SSL/HTTPS; correct redirects (www/non-www, http→https); domain confirmed.
- [ ] `sitemap.xml`, `robots.txt`, canonical, `hreflang` in place; structured data validated.
- [ ] OG/Twitter cards, favicon/app icons (brand mark) set.
- [ ] 404 (and error) pages live with correct status codes.
- [ ] Analytics + error monitoring live and verified.
- [ ] Performance budgets green in production build (CWV).
- [ ] Accessibility final pass green (AR/EN).
- [ ] Admin panel live, secured, and verified (Services/Clients CRUD).
- [ ] Forms deliver to the correct destination; spam protection active; success/failure verified in production.
- [ ] Cross-browser/device final smoke test in production.
- [ ] Backup/rollback plan ready.

### 29. Deployment Checklist (deploy)

- [ ] Deploy from an approved, tagged build.
- [ ] Environment config/secrets set via env vars (no secrets in repo — Doc 07 §9).
- [ ] CDN + caching + compression (brotli/gzip) configured.
- [ ] Post-deploy smoke test: all 5 pages load in AR/EN; nav/language switch/forms/admin work; no console errors.
- [ ] Verify CWV and Lighthouse on the live URL.

### 30. Post-launch Checklist

- [ ] Monitor error tracking + analytics for the first 24–72h; triage issues.
- [ ] Submit sitemap to search consoles; verify indexing and `hreflang` pairing.
- [ ] Monitor Core Web Vitals field data; address regressions.
- [ ] Verify form submissions are arriving; confirm lead flow with the client.
- [ ] Confirm admin edits (Services/Clients) reflect correctly in production.
- [ ] Collect stakeholder feedback; log polish/enhancement items for a maintenance backlog.
- [ ] Confirm all `⚠ VERIFY`/open items (Doc 00/Doc 01) are permanently resolved in production.
- [ ] Schedule a post-launch review and document lessons learned.

---

## PART F — WORKFLOW SUMMARY

```
Setup → Design System → [Navigation → Hero → About → Services → Clients → Contact → Admin]
        each section:  BUILD → self-check → 15 REVIEWS → fix/iterate → QUALITY GATES → APPROVAL
→ Global Assembly (review+approval)
→ Final Polish (visual/animation/micro/responsive/a11y/perf/SEO/cleanup/audits/testing/QA)
→ Deployment (launch + deploy checklists)
→ Post-launch (monitor + verify + backlog)

RULE: no section starts before the previous is APPROVED.
RULE: no phase advances until ALL quality gates are green.
RULE: the documentation package (Docs 00–10) is the single source of truth; nothing ships that contradicts it.
```

---

*End of Document 11 — Build Workflow.*
