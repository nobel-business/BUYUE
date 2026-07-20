'use client';

import { useRef, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { Link } from '@/i18n/navigation';
import { Heading, Text, Eyebrow } from '@/components/typography/Typography';
import { buttonClasses } from '@/components/Button/Button';
import styles from './ServicesStack.module.css';

/**
 * Ambient dust for the background — hand-placed, never random, so server and client
 * render identically. Varied size/opacity/duration (and no shared factor between the
 * durations) keeps the drift from ever resolving into a visible loop.
 */
const PARTICLES = [
  { x: 8, y: 22, size: 2, op: 0.3, dur: 61, delay: -4 },
  { x: 17, y: 68, size: 1, op: 0.22, dur: 74, delay: -19 },
  { x: 24, y: 12, size: 3, op: 0.16, dur: 53, delay: -31 },
  { x: 31, y: 84, size: 2, op: 0.26, dur: 88, delay: -7 },
  { x: 38, y: 41, size: 1, op: 0.34, dur: 67, delay: -46 },
  { x: 45, y: 74, size: 2, op: 0.18, dur: 79, delay: -12 },
  { x: 52, y: 19, size: 1, op: 0.28, dur: 59, delay: -38 },
  { x: 58, y: 57, size: 3, op: 0.14, dur: 83, delay: -23 },
  { x: 64, y: 31, size: 2, op: 0.24, dur: 71, delay: -55 },
  { x: 70, y: 88, size: 1, op: 0.32, dur: 63, delay: -2 },
  { x: 76, y: 14, size: 2, op: 0.2, dur: 91, delay: -41 },
  { x: 81, y: 63, size: 1, op: 0.27, dur: 57, delay: -16 },
  { x: 86, y: 37, size: 3, op: 0.15, dur: 77, delay: -49 },
  { x: 90, y: 78, size: 2, op: 0.23, dur: 69, delay: -28 },
  { x: 94, y: 26, size: 1, op: 0.31, dur: 85, delay: -9 },
  { x: 13, y: 47, size: 2, op: 0.19, dur: 73, delay: -34 },
  { x: 43, y: 6, size: 1, op: 0.25, dur: 65, delay: -52 },
  { x: 67, y: 95, size: 2, op: 0.17, dur: 81, delay: -21 },
];

export type ServiceCard = {
  title: string;
  intro: string;
  hasOffer: boolean;
  features: string[];
  value: string;
};

type ServicesStackProps = {
  cards: ServiceCard[];
  offerLabel: string;
  valueLabel: string;
  ctaLabel: string;
  ctaHref: string;
  exitUpLabel: string;
  exitDownLabel: string;
};

/**
 * Services as a step-based 3D card story (Doc 09 Page 3 content, unchanged).
 *
 * Desktop: when the section reaches the top of the viewport it captures the wheel —
 * one wheel gesture advances exactly ONE service (presentation-slide feel). Page
 * scroll is paused (Lenis stop) so nothing moves except the cards; each transition is
 * a single locked 0.8s crossfade in depth (current card recedes + fades + blurs, next
 * card comes forward and sharpens). At service 10 a further downward gesture releases
 * the page; at service 01 an upward gesture releases it back to the previous section —
 * no pin spacer, no blank scroll. The bottom rail tracks the active service and its
 * numbers are clickable.
 *
 * Tablet/mobile + reduced motion: no capture, no 3D — the cards stack as calm sections.
 *
 * Content is verbatim (Arabic is final, Doc 02 §3) — only the interaction changes.
 */
export function ServicesStack({
  cards,
  offerLabel,
  valueLabel,
  ctaLabel,
  ctaHref,
  exitUpLabel,
  exitDownLabel,
}: ServicesStackProps) {
  const root = useRef<HTMLElement>(null);
  const shouldReduce = useReducedMotion();
  const N = cards.length;

  useGSAP(
    () => {
      if (shouldReduce || !root.current) return;
      const rootEl = root.current;
      const mm = gsap.matchMedia();

      // Wheel-capable pointers only. The takeover advances on `wheel` and locks the page
      // with `touch-action: none`, so on a touch device (iPad landscape is >861px) it
      // would freeze the page with no gesture able to advance or escape it.
      mm.add('(min-width: 861px) and (hover: hover) and (pointer: fine)', () => {
        const cardEls = gsap.utils.toArray<HTMLElement>('[data-card]', rootEl);
        const dots = gsap.utils.toArray<HTMLButtonElement>('[data-dot]', rootEl);
        if (!cardEls.length) return;

        // ── Depth: a symmetric recede. Active card front (crisp, opaque); every other
        // card sits back, faded, blurred (a clean slide, not a peeking stack). ──────
        const apply = (el: HTMLElement, d: number) => {
          const a = Math.min(1, Math.abs(d));
          gsap.set(el, {
            z: -120 * a,
            scale: 1 - 0.03 * a,
            autoAlpha: 1 - a,
            filter: `blur(${(10 * a).toFixed(2)}px)`,
            zIndex: 100 - Math.round(a * 100),
            force3D: true,
          });
        };

        const state = { pos: 0 };
        let current = 0;
        let engaged = false;
        let locked = false;
        let lastWheelAt = 0; // end of the last wheel gesture (see onWheel)

        const paint = () => {
          for (let i = 0; i < cardEls.length; i++) apply(cardEls[i]!, i - state.pos);
          const active = Math.max(0, Math.min(N - 1, Math.round(state.pos)));
          for (let i = 0; i < dots.length; i++) {
            dots[i]!.dataset.state = i === active ? 'active' : i < active ? 'past' : 'future';
          }
        };

        // Animate to a target index — a single locked step (never queued).
        const goTo = (target: number) => {
          const clamped = Math.max(0, Math.min(N - 1, target));
          if (locked || clamped === current) return;
          locked = true;
          current = clamped;
          gsap.to(state, {
            pos: clamped,
            duration: 0.8,
            ease: 'power3.inOut',
            onUpdate: paint,
            onComplete: () => {
              locked = false;
            },
          });
        };

        const lenisStop = () => window.dispatchEvent(new Event('buyue:lenis-stop'));
        const lenisStart = () => window.dispatchEvent(new Event('buyue:lenis-start'));

        // Snap the one-viewport scene to sit flush with the viewport top. Without this
        // the wheel gesture that triggers engagement overshoots 'top top' by a random
        // amount and the lock freezes the page mid-scroll — leaving the card scene
        // shoved up (clipped card, progress rail floating mid-screen, the next section
        // peeking in below).
        //
        // Two things this MUST get right, and they pull in opposite directions:
        //  · `behavior: 'instant'` — <html> carries `scroll-behavior: smooth`, which the
        //    two-arg `scrollTo(x, y)` form obeys. An animated align is then cut short by
        //    the lock, stranding the scene mid-scroll. 'instant' also lands the scroll
        //    SYNCHRONOUSLY, so there is no window for the user to race it.
        //  · run it BEFORE the lock. `overflow: hidden` permits programmatic scrolling on
        //    an ordinary element, but on the ROOT element it propagates to the viewport,
        //    which then has no scrollable overflow at all — scrollTo becomes a silent
        //    no-op and the scene freezes wherever the reader happened to be.
        const alignToTop = () => {
          const top = Math.round(rootEl.getBoundingClientRect().top + window.scrollY);
          if (Math.abs(window.scrollY - top) > 1) {
            window.scrollTo({ top, left: 0, behavior: 'instant' });
          }
        };

        // The section is exactly one viewport tall, so its 'top top' and 'bottom bottom'
        // triggers share a SINGLE scroll position. Without a guard, the very gesture that
        // releases at card 01/10 lands right back on that point and instantly re-engages —
        // trapping the user in the scene. On release we disarm, then re-arm as soon as the
        // scroll has moved off the trigger point — deferred by one frame so the exit
        // gesture's own (synchronous) trigger stays blocked regardless of listener order.
        // Because re-arming keys off leaving the point (not a fixed distance), reversing
        // straight back into the scene still re-engages naturally, at any scroll speed.
        let armed = true;
        let stopRearmWatch: (() => void) | null = null;
        const disarmUntilAway = () => {
          armed = false;
          if (stopRearmWatch) return; // a watcher is already running
          const onScrollAway = () => {
            if (Math.abs(rootEl.getBoundingClientRect().top) > 4) {
              stopRearmWatch?.();
              requestAnimationFrame(() => {
                armed = true;
              });
            }
          };
          stopRearmWatch = () => {
            window.removeEventListener('scroll', onScrollAway);
            stopRearmWatch = null;
          };
          window.addEventListener('scroll', onScrollAway, { passive: true });
        };

        const engage = (from: 'top' | 'bottom') => {
          if (engaged || !armed) return;
          engaged = true;
          stopRearmWatch?.(); // we're back in the scene — cancel any pending re-arm
          armed = true;
          alignToTop(); // place the scene exactly (synchronous)…
          lenisStop(); // …then freeze the page, holding that aligned position
          // The gesture that scrolled us in is still shedding momentum events. Count
          // them as part of that gesture so entering the scene never also steps it.
          lastWheelAt = performance.now();
          current = from === 'top' ? 0 : N - 1;
          state.pos = current;
          paint();
        };
        const release = () => {
          if (!engaged) return;
          engaged = false;
          lenisStart();
          disarmUntilAway(); // don't let the exit gesture snap us straight back in
        };

        // Wheel capture: while engaged, one gesture = one step; boundaries release
        // the page (the releasing gesture is allowed through so exit feels natural).
        //
        // A trackpad flick emits a long decaying tail of wheel events, so "one event =
        // one step" would rip through several services per gesture — and a tail arriving
        // at a boundary would release the page the user never asked to leave. A gesture
        // is therefore treated as ongoing until the wheel has been quiet for GESTURE_GAP.
        const GESTURE_GAP = 120;

        // A service taller than the viewport scrolls its own copy first; only once it
        // has bottomed out (or topped out) does the gesture advance the story. Without
        // this the card is capped for readability but its overflow is unreachable,
        // because the wheel is captured and the page itself is locked.
        const overflowFor = (idx: number) =>
          cardEls[idx]?.querySelector<HTMLElement>('[data-scroll]');
        const canScrollInner = (dir: number) => {
          const inner = overflowFor(current);
          if (!inner) return false;
          const max = inner.scrollHeight - inner.clientHeight;
          if (max <= 1) return false;
          return dir > 0 ? inner.scrollTop < max - 1 : inner.scrollTop > 1;
        };

        const onWheel = (e: WheelEvent) => {
          if (!engaged) return;
          const dir = e.deltaY > 0 ? 1 : -1;
          // Let the card consume the gesture while it still has copy to reveal. Keep the
          // gesture clock ticking so bottoming out mid-flick does not also step a card.
          if (!locked && canScrollInner(dir)) {
            lastWheelAt = e.timeStamp;
            return;
          }
          const isNewGesture = e.timeStamp - lastWheelAt > GESTURE_GAP;
          lastWheelAt = e.timeStamp;

          // Mid-gesture momentum, or a step still animating: swallow it entirely.
          if (!isNewGesture || locked) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return;
          }

          const target = current + dir;
          if (target < 0 || target >= N) {
            release(); // let this gesture scroll the page out of the section
            return;
          }
          e.preventDefault();
          e.stopImmediatePropagation();
          goTo(target);
        };
        window.addEventListener('wheel', onWheel, { passive: false, capture: true });

        // Keyboard parity — the page is locked while engaged, so without this a keyboard
        // user reaching the scene can neither advance it nor scroll past it.
        const onKeyDown = (e: KeyboardEvent) => {
          if (!engaged) return;
          // The scene owns Space/arrows on the WINDOW, so without this a keyboard user
          // who has tabbed to a rail number or an exit arrow would have their Space
          // swallowed to step a card instead of activating the button they focused.
          if ((e.target as HTMLElement | null)?.closest('button, a, input, textarea, select'))
            return;
          const key = e.key;
          let target: number | null = null;
          // Same deference as the wheel: read the rest of a tall card before stepping.
          if (key === 'ArrowDown' && canScrollInner(1)) return;
          if (key === 'ArrowUp' && canScrollInner(-1)) return;
          if (key === 'ArrowDown' || key === 'PageDown' || key === ' ') target = current + 1;
          else if (key === 'ArrowUp' || key === 'PageUp') target = current - 1;
          else if (key === 'Home') target = 0;
          else if (key === 'End') target = N - 1;
          else if (key === 'Escape') {
            release(); // let me out — continue down the page normally
            return;
          }
          if (target === null) return;
          e.preventDefault();
          if (target < 0 || target >= N) release();
          else goTo(target);
        };
        window.addEventListener('keydown', onKeyDown);

        // Engage exactly when the section fills the viewport. The section is one viewport
        // tall, so BOTH directions engage at the same scroll position — 'top top' — and a
        // single trigger covers them:
        //  · scrolling down → forward past start  (onEnter)     → start at service 01
        //  · scrolling up   → backward past start (onLeaveBack) → start at service 10
        //
        // Note `onEnterBack` is NOT the up-scroll counterpart of `onEnter`: it fires on the
        // trigger's `end`, not its `start`. Pairing it with a 'bottom bottom' start left the
        // end at its default 'bottom top' — a full viewport further down the page — so
        // scrolling up engaged the moment the section first peeked in and `alignToTop`
        // teleported the page 100vh.
        const st = ScrollTrigger.create({
          trigger: rootEl,
          start: 'top top',
          onEnter: () => engage('top'),
          onLeaveBack: () => engage('bottom'),
        });

        // Click a number → animate straight to that service.
        const onDot = (i: number) => () => {
          // An explicit click always enters the scene, even while disarmed — otherwise
          // clicking a number just after an exit silently animates cards on a live page.
          armed = true;
          if (!engaged) engage('top');
          goTo(i);
        };
        const dotHandlers = dots.map((dot, i) => {
          const h = onDot(i);
          dot.addEventListener('click', h);
          return h;
        });

        // Exit arrows → release the wheel capture and glide the page clear of the whole
        // section, in either direction, from ANY service. Without the up arrow the only
        // way out backwards was to step all the way back to service 01.
        const exitBtns = gsap.utils.toArray<HTMLButtonElement>('[data-exit]', rootEl);
        const onExit = (dir: 'up' | 'down') => () => {
          release();
          requestAnimationFrame(() => {
            const rect = rootEl.getBoundingClientRect();
            const target =
              dir === 'down'
                ? Math.round(rect.bottom + window.scrollY)
                : // One viewport above the section's top edge — i.e. the content before it.
                  Math.max(0, Math.round(rect.top + window.scrollY - window.innerHeight));
            window.scrollTo({ top: target, behavior: 'smooth' });
          });
        };
        const exitHandlers = exitBtns.map((btn) => {
          const h = onExit(btn.dataset.exit === 'up' ? 'up' : 'down');
          btn.addEventListener('click', h);
          return h;
        });

        paint();

        return () => {
          window.removeEventListener('wheel', onWheel, { capture: true });
          window.removeEventListener('keydown', onKeyDown);
          dots.forEach((dot, i) => dot.removeEventListener('click', dotHandlers[i]!));
          exitBtns.forEach((btn, i) => btn.removeEventListener('click', exitHandlers[i]!));
          st.kill();
          stopRearmWatch?.(); // drop the re-arm scroll watcher if one is pending
          gsap.killTweensOf(state);
          // Release only a lock we actually took. The provider's lock is ref-counted and
          // shared with the intro cover, so an unmatched release here would drop the
          // cover's lock and let the page scroll underneath it.
          if (engaged) {
            engaged = false;
            lenisStart();
          }
        };
      });
    },
    { scope: root, dependencies: [shouldReduce] },
  );

  return (
    <section ref={root} className={styles.section} aria-label="Services">
      {/* ── Background only. Purely decorative, never interactive; the layer order
          here IS the depth order: base → glow → geometry → rays → grid → lines →
          particles → grain → vignette, with the card stage above all of it. ────── */}
      <div className={styles.bg} aria-hidden="true">
        <span className={styles.bgBase} />
        <span className={styles.bgGlowWarm} />
        <span className={styles.bgGlowText} />
        <span className={styles.bgGeoA} />
        <span className={styles.bgGeoB} />
        <span className={styles.bgGeoC} />
        <span className={styles.bgRays} />
        <span className={styles.bgGrid} />
        <span className={styles.bgLineA} />
        <span className={styles.bgLineB} />
        <span className={styles.bgLineC} />
        <div className={styles.bgDust}>
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className={styles.particle}
              style={
                {
                  '--px': `${p.x}%`,
                  '--py': `${p.y}%`,
                  '--size': `${p.size}px`,
                  '--op': `${p.op * 100}%`,
                  '--dur': `${p.dur}s`,
                  '--delay': `${p.delay}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <span className={styles.bgGrain} />
        <span className={styles.bgVignette} />
      </div>

      <div className={styles.stage}>
        {cards.map((card, i) => (
          <article key={i} className={styles.card} data-card aria-label={card.title}>
            <div className={styles.inner} data-scroll>
              <Heading level={2} className={styles.title}>
                {card.title}
              </Heading>
              <Text tone="secondary" className={styles.intro}>
                {card.intro}
              </Text>

              <div className={styles.offer}>
                {card.hasOffer && <Eyebrow>{offerLabel}</Eyebrow>}
                <ul className={styles.features}>
                  {card.features.map((feature, fi) => (
                    <li key={fi}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.valueRow}>
                <Eyebrow>{valueLabel}</Eyebrow>
                <Text className={styles.value}>{card.value}</Text>
              </div>

              <div className={styles.ctaRow}>
                <Link href={ctaHref} className={buttonClasses('on-dark-primary', 'md')}>
                  {ctaLabel}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Progress rail — active highlighted, past dim, future subtle; clickable. */}
      <ol className={styles.progress}>
        {cards.map((_, i) => (
          <li key={i}>
            <button
              type="button"
              className={styles.dot}
              data-dot
              data-state={i === 0 ? 'active' : 'future'}
              aria-label={`Service ${i + 1}`}
            >
              {String(i + 1).padStart(2, '0')}
            </button>
          </li>
        ))}
      </ol>

      {/* Leave the step-story in either direction — one click, from any service. */}
      <div className={styles.exitNav}>
        <button type="button" className={styles.exitBtn} data-exit="up" aria-label={exitUpLabel}>
          <svg
            className={styles.exitIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17l5-5 5 5M7 11l5-5 5 5" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.exitBtn}
          data-exit="down"
          aria-label={exitDownLabel}
        >
          <svg
            className={styles.exitIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 7l5 5 5-5M7 13l5 5 5-5" />
          </svg>
        </button>
      </div>
    </section>
  );
}
