'use client';

import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import styles from './HomeThumb.module.css';

/**
 * The falling reaction — a large glossy 3D "like" that drops out of the home hero as you
 * scroll and settles into the band before Services, then turns slowly on its own axis.
 *
 * Motion = "The Tumble" (approved via mockup): a wide left→right arc + a multi-axis tumble
 * + a depth swoop (scales up toward the viewer at mid-fall, back at rest) + a springy
 * drop-bounce on landing. The whole descent is scroll-scrubbed (GSAP ScrollTrigger), so the
 * scrollbar is the playhead — scroll back up and it un-falls. Once landed, a separate infinite
 * tween spins it (a DIFFERENT node, so the two never fight over `rotateY`).
 *
 * In-flow only — a sticky pin + absolute icon, never `position: fixed` (which the page-
 * transition template's transform would break; see LandingScene). Flow-anchored to the hero
 * tail, so it self-adapts to both the 300vh armed and ~100vh settled hero with no branching.
 * Reduced motion / no-JS → the thumb renders statically in its landed pose (CSS default).
 */

const THUMB_D =
  'M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 6.59 7.59C6.22 7.95 6 8.45 6 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z';

type HomeThumbProps = {
  /** Arabic (default locale) → mirror the horizontal arc. */
  rtl?: boolean;
};

export function HomeThumb({ rtl = false }: HomeThumbProps) {
  const root = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  useGSAP(
    () => {
      if (shouldReduce || !root.current) return;
      const rootEl = root.current;
      const fallEl = rootEl.querySelector<HTMLElement>('[data-thumb-fall]');
      const spinEl = rootEl.querySelector<HTMLElement>('[data-thumb-spin]');
      if (!fallEl || !spinEl) return;

      const sign = rtl ? -1 : 1;
      const vh = () => window.innerHeight;
      const vw = () => window.innerWidth;

      gsap.set(fallEl, { transformPerspective: 800, force3D: true });

      // The fall / tumble / swoop — ONE scrubbed timeline (units 0..100). `ease:'none'` on
      // the descent keeps it 1:1 with scroll; `bounce.out` is confined to the final y drop.
      // All rotations land on multiples of 360 so the thumb rests forward-facing + upright.
      //
      // The scrub runs from when the band's top reaches the viewport top (the pin becomes
      // stuck, so the thumb is held IN VIEW as it falls) over ~0.55 viewport of scroll — so
      // it LANDS while still pinned, well before the pin releases, leaving a rest window
      // where it sits and spins. `clamp(...)` keeps the start from resolving to a negative
      // scroll on the short (settled 100vh) hero, which would pre-materialise it mid-hero.
      const fall = gsap.timeline({
        scrollTrigger: {
          trigger: rootEl,
          start: 'clamp(top top)',
          end: () => '+=' + Math.round(window.innerHeight * 0.55),
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      fall
        .fromTo(
          fallEl,
          {
            x: 0,
            y: () => -vh() * 0.55,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 0.6,
            autoAlpha: 0,
          },
          {
            x: () => -vw() * 0.15 * sign,
            y: () => -vh() * 0.34,
            rotateX: 40,
            rotateY: 200,
            rotateZ: -160,
            scale: 1.5, // swoop TOWARD the viewer at mid-fall
            autoAlpha: 1,
            ease: 'none',
            duration: 40,
          },
          0,
        )
        .to(
          fallEl,
          {
            x: () => vw() * 0.15 * sign,
            y: () => -vh() * 0.1,
            rotateX: 380,
            rotateY: 480,
            rotateZ: -520,
            scale: 1.14, // pull back
            ease: 'none',
            duration: 40,
          },
          40,
        )
        // Land: y bounces (the drop), orientation/scale settle smoothly — split so the
        // rotation doesn't wobble on the spring.
        .to(fallEl, { y: 0, ease: 'bounce.out', duration: 20 }, 80)
        .to(
          fallEl,
          {
            x: 0,
            rotateX: 360,
            rotateY: 720,
            rotateZ: -720,
            scale: 1,
            ease: 'power2.out',
            duration: 20,
          },
          80,
        );

      // Persistent rest self-rotation — its OWN node + channel, so it never fights the
      // scrubbed tumble. It begins JUST AFTER the fall lands (gate start is past the fall's
      // end) so the two never overlap, plays through the rest window while the thumb sits
      // in view, and pauses once it scrolls off the top OR the tab is hidden (perf — never
      // spin an invisible thumb).
      const spin = gsap.to(spinEl, {
        rotateY: '+=360',
        duration: 14,
        ease: 'none',
        repeat: -1,
        paused: true,
      });
      let inView = false;
      let tabVisible = typeof document === 'undefined' || !document.hidden;
      const applySpin = () => (inView && tabVisible ? spin.play() : spin.pause());
      const gate = ScrollTrigger.create({
        trigger: rootEl,
        start: () => 'top top-=' + Math.round(window.innerHeight * 0.57), // just past the land
        end: () => 'top top-=' + Math.round(window.innerHeight * 1.4), // ~when it exits the top
        onToggle: (self) => {
          inView = self.isActive;
          applySpin();
        },
      });
      const onVisibility = () => {
        tabVisible = !document.hidden;
        applySpin();
      };
      document.addEventListener('visibilitychange', onVisibility);

      // Reconcile trigger positions once the page-transition wrapper's blur/lift has settled.
      const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 700);

      return () => {
        clearTimeout(refresh);
        document.removeEventListener('visibilitychange', onVisibility);
        gate.kill();
        spin.kill();
        fall.scrollTrigger?.kill();
        fall.kill();
      };
    },
    { scope: root, dependencies: [shouldReduce, rtl] },
  );

  return (
    <div ref={root} className={styles.band} aria-hidden="true">
      <div className={styles.pin}>
        <div data-thumb-fall className={styles.fall}>
          <div data-thumb-spin className={styles.spin}>
            <svg viewBox="0 0 24 24" role="presentation">
              <defs>
                <linearGradient id="ht-body" x1="0.15" y1="0" x2="0.85" y2="1">
                  <stop offset="0" stopColor="#ffb083" />
                  <stop offset="0.42" stopColor="#e2603c" />
                  <stop offset="1" stopColor="#8f2a17" />
                </linearGradient>
                <radialGradient id="ht-hi" cx="0.32" cy="0.2" r="0.6">
                  <stop offset="0" stopColor="rgba(255,244,228,0.92)" />
                  <stop offset="0.7" stopColor="rgba(255,244,228,0)" />
                </radialGradient>
                <radialGradient id="ht-ao" cx="0.72" cy="0.86" r="0.72">
                  <stop offset="0" stopColor="rgba(60,12,2,0.5)" />
                  <stop offset="0.65" stopColor="rgba(60,12,2,0)" />
                </radialGradient>
                <filter id="ht-drop" x="-30%" y="-30%" width="160%" height="170%">
                  <feDropShadow dx="0" dy="0.5" stdDeviation="0.7" floodColor="rgba(0,0,0,0.5)" />
                </filter>
                <filter id="ht-blur">
                  <feGaussianBlur stdDeviation="0.45" />
                </filter>
              </defs>
              <g filter="url(#ht-drop)">
                <path d={THUMB_D} fill="url(#ht-body)" />
                <path d={THUMB_D} fill="url(#ht-hi)" />
                <path d={THUMB_D} fill="url(#ht-ao)" />
                <path
                  d={THUMB_D}
                  fill="none"
                  stroke="rgba(255,222,188,0.42)"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
                <ellipse
                  cx="10"
                  cy="5"
                  rx="1.7"
                  ry="1.1"
                  fill="rgba(255,250,242,0.85)"
                  filter="url(#ht-blur)"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
