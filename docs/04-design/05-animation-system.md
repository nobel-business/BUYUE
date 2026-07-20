# 05 — Animation & Motion System
### Buyue (بيوع) — Motion Design Specification

> **Purpose:** Define a single, consistent motion language for the entire site so movement feels intentional, premium, and coordinated — never random. This spec is prescriptive: it names the timings, easings, and behaviors every engineer and designer must reuse.
>
> **Benchmark references (client-provided):** `https://azure.sa/` and `https://above-limits.com/`. These define the *quality bar and feel* — smooth scroll, cinematic reveals, refined hovers, premium pacing — **not** a design to copy. Study their motion quality; express it through Buyue's own visual language.

---

## 1. Animation Philosophy (read first)

**Motion is how Buyue proves it is modern, crafted, and cinematic — the same qualities it sells.** Every movement must earn its place.

Four laws govern all motion on this site:

1. **Purpose over decoration.** Animation must clarify (hierarchy), reveal (pacing), give feedback (interaction), or create continuity (transitions). If it does none of these, remove it.
2. **Smooth, weighted, and eased.** Premium motion slows in and out, carries subtle physical weight, and never uses default linear timing.
3. **Coordinated, not chaotic.** Related elements move together in orchestrated stagger; the page never feels like independent parts twitching.
4. **Never at the cost of performance or accessibility.** Transform/opacity only, 60fps, and full respect for `prefers-reduced-motion`.

**The feeling target:** a cinematic short film — deliberate pacing, elegant reveals, quiet confidence. Not a demo reel of effects.

---

## 2. Global Timing, Duration & Easing (the shared vocabulary)

Everything below reuses these tokens. Do not invent one-off values.

### 2.1 Duration scale
| Token | Value | Use |
|-------|-------|-----|
| dur-instant | 100ms | tiny feedback (press) |
| dur-fast | 200ms | hover, focus, small UI |
| dur-base | 300ms | default UI transitions |
| dur-medium | 500ms | section/element entrances |
| dur-slow | 700ms | hero, large reveals |
| dur-xslow | 1000ms+ | cinematic hero/background moments |

### 2.2 Easing curves
| Token | cubic-bezier | Feel / use |
|-------|--------------|------------|
| ease-standard | `(0.4, 0.0, 0.2, 1)` | default UI in/out |
| ease-out-soft | `(0.16, 1, 0.3, 1)` | premium entrances (slow, elegant settle) |
| ease-in-out-lux | `(0.65, 0, 0.35, 1)` | cinematic, symmetrical moves |
| ease-emphasis | `(0.34, 1.56, 0.64, 1)` | subtle overshoot for tactile pop (use sparingly) |
| ease-linear | `linear` | **only** for continuous loops (marquees, spinners) |

**Defaults:** entrances use `ease-out-soft`; interactive feedback uses `ease-standard`; large cinematic moves use `ease-in-out-lux`. Avoid `ease-emphasis` on large elements.

### 2.3 Stagger
- Default stagger between grouped items: **60–90ms**.
- Max recommended items animated in one group: ~8 (beyond that, reduce stagger or animate as a block).

### 2.4 Distance
- Entrance translate distance: **16–40px** (subtle). Large hero elements up to 64px. Never animate huge jumps.

---

## 3. Page Loading

- **First load:** a brief, branded loader (logo mark on Bonfire Flame or Black Powder) — max ~1.2s; must not block perceived performance. Prefer a lightweight reveal over a heavy pre-loader.
- **Reveal:** loader fades (dur-slow, ease-out-soft) into the hero; hero content then enters (see Hero).
- **Progressive:** content below the fold is not gated by the loader — it lazy-reveals on scroll.
- **No FOUC:** fonts (Zarid, Articulat) load with `font-display: swap` and a matched fallback to avoid layout shift.
- **Reduced motion:** loader becomes a simple fade or is skipped entirely.

---

## 4. Page Transition

- **Between pages:** a smooth cross-transition (fade + subtle motif wipe using the angular "carpet-stripe" shape) — dur-medium to dur-slow, ease-in-out-lux.
- **Continuity:** persistent nav/logo stays put; only the content region transitions.
- **RTL:** wipe direction mirrors for Arabic (enters from the right).
- **Never:** a full white flash or abrupt cut.
- **Reduced motion:** replace with a plain, quick fade.

---

## 5. Navigation

- **On load:** nav fades/slides in subtly (dur-base).
- **On scroll:** nav condenses (height + background shift to a translucent Black Powder/Springtime Rain with blur) — dur-base, ease-standard.
- **Hide/show:** optionally hide on scroll-down, reveal on scroll-up (smooth, dur-base).
- **Mobile menu:** slides in from the start edge (right in RTL, left in LTR), dur-medium ease-out-soft; items stagger in (60ms); background scrim fades.
- **Active link:** animated Bonfire Flame underline/indicator that slides between items.
- **Language switch:** smooth fade + mirrored reflow, no jarring jump.

---

## 6. Hero

The hero sets the cinematic tone. Orchestrated entrance on load:

1. Background (image/motif/color) eases in with a slow scale-settle (dur-xslow, ease-in-out-lux) — subtle Ken-Burns permitted.
2. Headline «نبيع كل شيء إلا الكلام» reveals via **mask/clip reveal** (see Mask Reveal), dur-slow, ease-out-soft.
3. Body copy fades/rises (translateY 24px), dur-medium, delayed ~150ms after headline.
4. CTAs (ابدأ مشروعك معنا / استعرض أعمالنا) rise and fade in last, staggered 80ms.
5. Optional: a slow parallax on the background as the user begins to scroll.

- **RTL:** reveal directions mirror.
- **Reduced motion:** all of the above become simple, quick fades; no scale/parallax.

---

## 7. Section Entry

- **Trigger:** when a section enters the viewport (~15–20% visible).
- **Behavior:** content fades + rises (translateY 24–32px), dur-medium, ease-out-soft.
- **Once:** animate on first entry only (don't re-animate on scroll-back) — unless a deliberate scrub effect.
- **Grouped children** stagger (60–90ms).
- Section backgrounds (color blocks) may cross-fade or wipe with the motif.

---

## 8. Cards

- **Entrance:** staggered rise+fade within their grid (60–90ms between cards), dur-medium.
- **Hover (desktop):** lift 2–4px (translateY) + shadow-sm→shadow-md, dur-fast, ease-standard; optional accent reveal (Bonfire Flame edge / Quilt Gold underline).
- **Press/tap:** scale 0.98, dur-instant.
- **Service cards:** icon/number may subtly animate on hover (e.g., a slight rotate or Bonfire Flame fill).
- **Reduced motion:** entrance = fade only; hover = color change only (no movement).

---

## 9. Buttons

- **Hover:** background darken/lift + shadow, dur-fast, ease-standard; optional icon nudge in reading direction (arrow slides toward the start edge in RTL).
- **Focus:** Bonfire Flame focus ring appears instantly (accessibility — no delay).
- **Press:** scale 0.98 + slight darken, dur-instant.
- **Loading state:** label swaps to an inline spinner/progress; button width stable (no layout shift).
- **Success (form):** morph to a confirmation state (check + "تم"/"Sent"), dur-base.
- **Reduced motion:** color-only feedback; keep focus ring.

---

## 10. Images

- **Reveal:** mask/clip reveal or fade+scale (from 1.05→1.0) as they enter viewport, dur-slow, ease-out-soft.
- **Parallax:** subtle vertical parallax within their container on scroll (see Parallax).
- **Hover (gallery):** gentle zoom (scale 1.03) + caption fade-in, dur-base.
- **Lazy-load:** images below the fold load lazily with a low-quality placeholder / blur-up that resolves smoothly.
- **Reduced motion:** static; no scale/parallax; still lazy-load and blur-up (blur-up is acceptable, keep it quick).

---

## 11. Background Elements

- **Motif (angular stripes):** may drift slowly / parallax at a different rate than content for depth (dur-xslow loops or scroll-linked).
- **Color blocks:** cross-fade/wipe on section change.
- **X-stitch texture:** static or extremely subtle; never distracting.
- Keep background motion **low-contrast and slow** — atmosphere, not attention.
- **Reduced motion:** freeze all background motion.

---

## 12. Typography (text animation)

- **Headings:** mask/line reveal (text rises out from a clipping mask), line-by-line stagger for multi-line headings, dur-slow, ease-out-soft.
- **Body:** simple fade+rise, dur-medium.
- **Emphasis words:** a single word may highlight (Bonfire Flame / Quilt Gold) on reveal — sparingly.
- **Arabic caution:** never animate individual Arabic glyphs in a way that breaks letter joining or RTL flow — animate whole words/lines only.
- **Reduced motion:** fade only.

---

## 13. Counters

- **Statistics** (e.g., "أكثر من 30 علامة تجارية"): count up from 0 to target when the stat scrolls into view, dur-slow, ease-out-soft.
- Count once; don't loop.
- Respect Arabic-Indic vs. Western numeral choice per the locale (confirm with client; keep consistent).
- **Reduced motion:** show the final number immediately (no count animation).

---

## 14. Statistics (section)

- The stat block enters as a group (fade+rise), then counters run.
- Optional accent: a Quilt Gold/Bonfire Flame underline draws in beneath each figure, dur-medium.
- Keep it dignified — statistics are a trust signal, not a fireworks moment.

---

## 15. Timeline

*(For any future "our process/journey" timeline — the brand narrates a journey "من الفكرة إلى السوق".)*
- **Behavior:** as the user scrolls, a progress line draws (Bonfire Flame) and each step reveals in sequence (fade+rise, 90ms stagger).
- **Pinned option:** the timeline may pin while steps advance (see Pinned Sections) — use judiciously.
- **RTL:** line progresses right-to-left.
- **Reduced motion:** all steps visible, line static.

---

## 16. Testimonials

*(Admin-managed client testimonials on the Clients page.)*
- **Carousel/slider:** smooth slide or cross-fade between quotes, dur-medium, ease-in-out-lux; auto-advance optional (pause on hover/focus; never trap keyboard).
- **Entrance:** quote fades/rises; author info follows with slight delay.
- **RTL:** slide direction mirrors; drag/swipe respects RTL.
- **Reduced motion:** disable auto-advance and slide; use fade + manual controls only.

---

## 17. Pricing

*(No pricing page in v1 scope. Reserved for future "packages" per the Services FAQ.)*
- If added: cards enter staggered; the recommended tier subtly emphasized (scale/shadow); toggle (monthly/annual) animates smoothly.
- **Reduced motion:** static entrance, instant toggle.

---

## 18. Forms

- **Field focus:** border transitions to Bonfire Flame + focus ring, dur-fast.
- **Label:** may float/shift on focus (if using floating labels) — but always keep a persistent visible label for accessibility.
- **Validation:** error shakes are **discouraged**; instead, error message fades in + border color change (dur-fast). Avoid motion sickness triggers.
- **Submit:** button → loading → success morph (see Buttons). Success confirmation fades in.
- **Stagger:** on the Contact form's first appearance, fields may reveal with a light stagger (60ms).
- **Reduced motion:** color-only state changes; no shake, no stagger.

---

## 19. Accordion

*(FAQ blocks appear on About, Services, Clients pages.)*
- **Expand/collapse:** smooth height animation with content fade, dur-base, ease-standard.
- **Icon:** chevron/plus rotates (dur-fast) to indicate state.
- **One-open (optional):** opening one may smoothly close others.
- **RTL:** icon and text alignment mirror; chevron rotation direction consistent.
- **Reduced motion:** instant open/close (no height tween), keep icon state change.
- **Accessibility:** proper `aria-expanded`, keyboard operable, focus managed.

---

## 20. FAQ

- FAQ items enter with the section (staggered rise+fade).
- Interaction = Accordion behavior above.
- Keep answers' reveal smooth and quick so scanning multiple questions feels effortless.

---

## 21. Footer

- **Entrance:** subtle fade+rise as it enters viewport.
- **Links:** hover underline reveal (Bonfire Flame/Quilt Gold).
- **Back-to-top:** if present, smooth-scrolls up (see Smooth Scroll) with a gentle button feedback.
- **Reduced motion:** fade only; back-to-top jumps instantly.

---

## 22. Scroll Behaviour

- The scroll experience is the backbone of the cinematic feel. All scroll-linked motion must be **smooth, performant, and reversible without jank.**
- Prefer scroll-**triggered** reveals (fire once) over heavy scroll-**scrubbed** effects, except where a scrub is intentional (parallax, pinned timeline).
- Never hijack scroll speed to the point the user loses control; momentum must feel natural.

---

## 23. Smooth Scroll

- **Enable** smooth scrolling site-wide (native `scroll-behavior` or a tuned smooth-scroll library matching the benchmark feel).
- Anchor links and back-to-top ease to target, dur-slow, ease-in-out-lux.
- Must not break browser find, keyboard scrolling, or accessibility.
- **Reduced motion:** disable smooth-scroll library; use instant/native jump.

---

## 24. Pinned Sections

- Use sparingly for high-impact moments (e.g., a services journey or a featured stat).
- A section pins while inner content advances (steps, images, text), then releases.
- Must degrade gracefully on mobile (often better to un-pin and stack on small screens).
- **Reduced motion / mobile:** disable pinning; present content as a normal stacked scroll.

---

## 25. Horizontal Scroll

- Optional for a gallery or services strip (a horizontally-scrolling row driven by vertical scroll).
- **RTL:** horizontal scroll direction mirrors (content advances leftward as expected in Arabic).
- Always provide a visible affordance (drag cue / arrows) and keyboard access.
- Avoid trapping the user; ensure they can scroll past.
- **Reduced motion / mobile:** convert to a normal swipeable/stacked layout.

---

## 26. Parallax

- **Subtle only:** background motif and hero/gallery images move at a slightly different rate than foreground content for depth.
- Max parallax offset: keep small (≤ ~15% of element height) to avoid disorientation and layout issues.
- Transform-based (translate3d) for GPU performance.
- **Reduced motion:** disable entirely (elements static).

---

## 27. Reveal Effects

- The primary entrance pattern: **fade + rise** (opacity 0→1, translateY 24–32px→0), dur-medium, ease-out-soft, triggered on viewport entry, once.
- Grouped elements stagger (60–90ms).
- Consistency is key — this is the site's default "hello."

---

## 28. Mask Reveal

- Signature premium reveal: content (headings, images) is revealed from behind a clipping mask — often shaped by the **angular "carpet-stripe" motif**.
- Headline text rises out of a mask line-by-line.
- Images unmask via the motif shape or a directional wipe.
- dur-slow, ease-out-soft; **RTL:** wipe direction mirrors.
- **Reduced motion:** replace mask reveal with a plain fade.

---

## 29. Stagger Animation

- Applied to any group: nav items, service cards, feature bullets, gallery items, form fields, footer links.
- 60–90ms between siblings; the group reads as one coordinated motion.
- Cap the perceived total (if many items, animate in the first row/visible set and let the rest fade in as scrolled).

---

## 30. Hover Effects

- **Buttons:** darken/lift + shadow + optional icon nudge.
- **Cards:** lift + shadow + accent reveal.
- **Links:** animated underline (Bonfire Flame/Quilt Gold).
- **Images:** gentle zoom + caption.
- **Logos (clients):** grayscale→color or subtle scale (optional).
- All hovers: dur-fast, ease-standard.
- **Touch devices:** provide an equivalent (active/tap state); never rely on hover to reveal essential content.

---

## 31. Micro-interactions

- Tuned feedback on every interactive element: press scale, focus ring, toggle transitions, form state changes, copy-to-clipboard confirmations, etc.
- Each is small, fast (dur-instant/dur-fast), and consistent site-wide.
- They make the UI feel alive and tactile — a core premium signal.

---

## 32. Cursor Behaviour

- **Desktop, optional custom cursor:** a refined custom cursor (small dot / ring) that subtly scales or changes on interactive elements, and may show contextual labels (e.g., "استعرض" / "View") over gallery items — matching the benchmark sites' feel.
- Must be tasteful, low-latency, and never obscure content.
- **Fallbacks:** default cursor on touch devices; graceful default if custom cursor fails.
- **Accessibility:** custom cursor must not reduce clarity of clickable areas; keyboard users unaffected.
- **Reduced motion:** disable cursor animation; use default cursor.

---

## 33. Accessibility Motion Rules

- **`prefers-reduced-motion: reduce` is mandatory.** When set:
  - Disable parallax, scale, scroll-scrub, pinning, auto-advance, mask/scale reveals, smooth-scroll libraries, counters, custom-cursor motion.
  - Replace with instant states or quick, minimal fades.
  - Keep essential feedback (focus rings, state color changes).
- No animation may cause flashing (>3 flashes/second is prohibited).
- Motion must never be the **only** way information is conveyed.
- Auto-playing motion must be pausable and must not loop indefinitely in a distracting way.
- Ensure all animated content remains keyboard-accessible and screen-reader coherent.

---

## 34. Performance Rules

- **Animate only `transform` and `opacity`** (GPU-friendly). Avoid animating layout properties (width, height, top, left, margin) except in controlled accordion height cases.
- Target **60fps**; if an animation can't hold it, simplify or cut it.
- Use `will-change` sparingly and remove it after animation.
- Throttle/debounce scroll handlers; prefer `IntersectionObserver` and `requestAnimationFrame` over scroll listeners.
- Lazy-load and code-split heavy animation libraries; don't block first paint.
- Keep total animation/JS weight within the performance budget (LCP < 2.5s, INP < 200ms, CLS < 0.1).
- Test on **mid-range mobile**, not just high-end desktop.
- Pause off-screen animations.

---

## 35. Animation Do's

- **Do** reuse the shared duration/easing tokens everywhere.
- **Do** default to fade+rise for entrances and stagger groups.
- **Do** use mask reveals and the angular motif as the signature premium moment.
- **Do** mirror all directional motion for RTL.
- **Do** animate transform/opacity only, at 60fps.
- **Do** fire entrance animations once, on viewport entry.
- **Do** provide full reduced-motion fallbacks.
- **Do** keep background/parallax motion subtle and slow.
- **Do** give every interactive element tuned feedback.
- **Do** benchmark feel against azure.sa and above-limits.com — quality, not copying.

---

## 36. Animation Don'ts

- **Don't** use default `linear`/`ease` on entrances.
- **Don't** animate layout properties or cause CLS.
- **Don't** run everything at once — respect pacing and stagger.
- **Don't** break Arabic letter joining or RTL flow with glyph-level animation.
- **Don't** hijack scroll so the user loses control.
- **Don't** loop distracting motion or auto-advance without pause.
- **Don't** rely on hover for essential content on touch devices.
- **Don't** ship animations that drop below 60fps on mid-range mobile.
- **Don't** ignore `prefers-reduced-motion`.
- **Don't** add motion that serves no purpose — when in doubt, cut it.

---

## 37. Motion Vocabulary Quick Reference

```
Entrance (default):  fade + rise 24–32px · dur-medium (500ms) · ease-out-soft · once · 60–90ms stagger
Hero:                background scale-settle · headline mask reveal · staggered CTAs · dur-slow/xslow
Reveal (signature):  mask/clip via angular motif · dur-slow · ease-out-soft · mirror for RTL
Hover:               lift 2–4px + shadow + accent · dur-fast · ease-standard
Press:               scale 0.98 · dur-instant
Accordion:           height + fade · dur-base · icon rotate
Counter:             count-up on view · dur-slow · once
Parallax:            subtle transform, ≤15% offset · disable on reduced-motion
Page transition:     fade + motif wipe · dur-medium/slow · ease-in-out-lux
ALWAYS:              transform/opacity only · 60fps · RTL-mirrored · reduced-motion fallback
```

---

*End of Document 05 — Animation & Motion System.*
