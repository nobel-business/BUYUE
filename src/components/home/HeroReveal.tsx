'use client';

import { useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { onPreloaderDone } from '@/lib/motion/preloader-signal';

/**
 * Cinematic hero choreography (Mission: unforgettable hero + motion hierarchy).
 * Wraps the server-rendered hero markup (via `display: contents`, so layout is
 * untouched) and drives:
 *
 *  1. ENTRANCE (on intro hand-off): motif → heading (mask) → body → CTAs. A soft
 *     infinite drift keeps the motif alive at rest.
 *  2. PINNED EXIT (desktop): the hero holds briefly while, tied to scroll, the
 *     content group lifts + fades and the motif trails slower — a layered, depth-
 *     ful hand-off into the next scene. Restrained (no scale/rotation tricks).
 *
 * Channel ownership avoids conflicts: entrance = children opacity/clip/y; pinned
 * exit = the content GROUP (`[data-hero-inner]`) + motif yPercent (a different
 * element/axis than the entrance and the drift). Reduced motion / mobile → no
 * pin; content simply renders and reveals. No-JS → fully visible.
 */
export function HeroReveal({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  useGSAP(
    () => {
      if (shouldReduce || !scope.current) return;
      const root = scope.current;
      const motif = root.querySelector('[data-hero-motif]');
      const inner = root.querySelector('[data-hero-inner]');
      const heading = root.querySelector('[data-hero-heading]');
      const body = root.querySelector('[data-hero-body]');
      const actions = root.querySelector('[data-hero-actions]');

      // Split the heading into per-word spans for a SplitText-style reveal. Done in
      // JS after SSR (the full text ships server-rendered for LCP/SEO; the split runs
      // under the preloader, so the swap is never visible). Split on whitespace only
      // → Arabic/RTL-safe; whitespace nodes are preserved so wrapping is unchanged.
      let words: HTMLElement[] = [];
      if (heading instanceof HTMLElement && heading.dataset.split !== 'true') {
        const tokens = (heading.textContent ?? '').split(/(\s+)/);
        heading.textContent = '';
        for (const token of tokens) {
          if (token.length === 0) continue;
          if (/^\s+$/.test(token)) {
            heading.appendChild(document.createTextNode(token));
            continue;
          }
          const span = document.createElement('span');
          span.textContent = token;
          span.style.display = 'inline-block';
          span.style.willChange = 'transform, opacity, filter';
          heading.appendChild(span);
          words.push(span);
        }
        heading.dataset.split = 'true';
      } else if (heading instanceof HTMLElement) {
        // Already split on a prior run (e.g. dev StrictMode remount): re-collect the
        // existing word spans so the entrance still has its targets.
        words = Array.from(heading.querySelectorAll<HTMLElement>('span'));
      }

      // Initial hidden states, pre-paint so nothing flashes before the hand-off.
      gsap.set(heading, { autoAlpha: 1 });
      gsap.set(words, { autoAlpha: 0, yPercent: 60, filter: 'blur(8px)' });
      gsap.set([body, actions], { autoAlpha: 0, y: 24 });
      if (motif) {
        gsap.set(motif, {
          rotation: -12,
          transformOrigin: 'center center',
          autoAlpha: 0,
          scale: 1.12,
        });
      }

      const entrance = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
      if (motif) {
        entrance.to(motif, { autoAlpha: 0.55, scale: 1, duration: 1.4, ease: 'power2.out' }, 0);
      }
      entrance
        .to(
          words,
          {
            autoAlpha: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.08,
            ease: 'expo.out',
            // Release the per-word compositor hint once revealed (no lingering layers).
            onComplete: () => {
              for (const word of words) word.style.willChange = 'auto';
            },
          },
          0.15,
        )
        .to(body, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.55')
        .to(actions, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.5');

      // Soft infinite drift on the motif (xPercent — its own channel).
      let drift: gsap.core.Tween | undefined;
      if (motif) {
        drift = gsap.to(motif, {
          xPercent: 2,
          duration: 6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          paused: true,
        });
      }

      // Pinned cinematic exit — desktop only (pinning is janky on touch).
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        const section = root.closest('section');
        if (!section) return;
        const exit = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=40%',
            pin: true,
            // `pinType: 'transform'` — never a fixed pin. Every page is wrapped by
            // app/[locale]/template.tsx, a motion.div animating `y` + `filter`;
            // either property makes it the containing block for `position: fixed`,
            // so the default fixed pin mis-positions and jumps. ValuesScene hit the
            // same thing and uses this fix.
            pinType: 'transform',
            pinSpacing: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
          defaults: { ease: 'none' },
        });
        // Content leads (lifts + fades); motif trails slower → depth.
        if (inner) exit.to(inner, { yPercent: -14, autoAlpha: 0.15 }, 0);
        if (motif) exit.to(motif, { yPercent: 12 }, 0);
      });

      // The page-transition wrapper is still animating `y`/`filter` when the pin is
      // built, so its start/end get measured against a moving ancestor. Reconcile
      // once it settles — same 700ms fix ValuesScene and AboutCinematicIntro use.
      const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 700);

      const off = onPreloaderDone(() => {
        entrance.play();
        drift?.play();
      });
      return () => {
        off();
        window.clearTimeout(refresh);
        mm.revert();
      };
    },
    { scope, dependencies: [shouldReduce] },
  );

  return (
    <div ref={scope} style={{ display: 'contents' }}>
      {children}
    </div>
  );
}
