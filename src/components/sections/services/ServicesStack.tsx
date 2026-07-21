'use client';

import { useRef, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { Link } from '@/i18n/navigation';
import { Heading, Text, Eyebrow } from '@/components/ui/Typography';
import { buttonClasses } from '@/components/ui/Button';
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
 * Services as a scroll-linked 3D card story (Doc 09 Page 3 content, unchanged).
 *
 * Desktop: the scene is CSS-`sticky` and centred, holding still in the viewport while a
 * tall track scrolls past it. ONE scrubbed ScrollTrigger maps the scroll across that
 * track to a floating card position, so the services follow the scroll continuously —
 * the current card recedes, fades and blurs while the next comes forward and sharpens.
 * `snap` settles on the nearest service when scrolling stops, so it always rests centred
 * on a card. No wheel capture, no page lock: ordinary, smooth scrolling. The bottom rail
 * tracks the active service and its numbers scroll straight to that card.
 *
 * Tablet/mobile + reduced motion: no sticky, no 3D — the cards stack as calm sections.
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

      // Wheel-capable, hover-capable pointers only. On touch the sticky scene still works
      // as ordinary scrolling; the 3D depth is a progressive enhancement for desktop.
      mm.add('(min-width: 861px) and (hover: hover) and (pointer: fine)', () => {
        const cardEls = gsap.utils.toArray<HTMLElement>('[data-card]', rootEl);
        const dots = gsap.utils.toArray<HTMLButtonElement>('[data-dot]', rootEl);
        const exitBtns = gsap.utils.toArray<HTMLButtonElement>('[data-exit]', rootEl);
        if (!cardEls.length) return;

        // Depth crossfade: the active card sits front (crisp, opaque); the further a card
        // is from the current position, the further back / more faded / more blurred.
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
        const paint = () => {
          for (let i = 0; i < cardEls.length; i++) apply(cardEls[i]!, i - state.pos);
          const active = Math.max(0, Math.min(N - 1, Math.round(state.pos)));
          for (let i = 0; i < dots.length; i++) {
            dots[i]!.dataset.state = i === active ? 'active' : i < active ? 'past' : 'future';
          }
        };
        paint();

        // ── One scrubbed tween drives the whole progression. Scroll across the tall
        // track maps 0 → N-1 onto the card position; `scrub` smooths it; `snap` settles
        // on the nearest service on scroll-end so it always rests centred on a card.
        // Same sticky-scrub pattern as the Clients logo wall (ClientLogoMosaic).
        const tween = gsap.to(state, {
          pos: N - 1,
          ease: 'none',
          onUpdate: paint,
          scrollTrigger: {
            trigger: rootEl,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
            ...(N > 1 && {
              snap: {
                snapTo: 1 / (N - 1),
                duration: { min: 0.2, max: 0.5 },
                ease: 'power2.inOut',
                delay: 0.04,
              },
            }),
          },
        });
        const st = tween.scrollTrigger!;

        // Click a number → smooth-scroll to that service's position on the track.
        const scrollToIndex = (i: number) => {
          const clamped = Math.max(0, Math.min(N - 1, i));
          const p = N > 1 ? clamped / (N - 1) : 0;
          window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: 'smooth' });
        };
        const dotHandlers = dots.map((dot, i) => {
          const h = () => scrollToIndex(i);
          dot.addEventListener('click', h);
          return h;
        });

        // Skip arrows → glide clear of the whole section, up (back to what precedes it)
        // or down (on to the FAQ), from wherever you are in the story.
        const onExit = (dir: 'up' | 'down') => () => {
          const rect = rootEl.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const bottom = rect.bottom + window.scrollY;
          const target = dir === 'down' ? bottom : Math.max(0, top - window.innerHeight);
          window.scrollTo({ top: target, behavior: 'smooth' });
        };
        const exitHandlers = exitBtns.map((btn) => {
          const h = onExit(btn.dataset.exit === 'up' ? 'up' : 'down');
          btn.addEventListener('click', h);
          return h;
        });

        // Reconcile with the page-transition wrapper once its blur/lift has settled.
        const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 700);

        return () => {
          window.clearTimeout(refresh);
          dots.forEach((dot, i) => dot.removeEventListener('click', dotHandlers[i]!));
          exitBtns.forEach((btn, i) => btn.removeEventListener('click', exitHandlers[i]!));
          st.kill();
          tween.kill();
          gsap.killTweensOf(state);
        };
      });
    },
    { scope: root, dependencies: [shouldReduce] },
  );

  return (
    <section
      ref={root}
      className={styles.section}
      aria-label="Services"
      style={{ '--count': N } as CSSProperties}
    >
      {/* The scene is pinned and centred via CSS `sticky` (desktop) while the section's
          tall track scrolls past it. On mobile / reduced motion this is a plain wrapper
          and the cards stack. */}
      <div className={styles.sticky}>
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

        {/* Skip the whole services story in either direction — one click, from anywhere. */}
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
      </div>
    </section>
  );
}
