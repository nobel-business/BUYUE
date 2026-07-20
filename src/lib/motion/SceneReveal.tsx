'use client';

import { useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from './gsap';
import { duration, gsapEase } from './tokens';

/**
 * Per-section reveal identities (Mission M3: no two sections animate the same).
 * One component, several distinct motions — pick a `variant` per scene:
 *
 *   rise  — fade + gentle lift (calm, editorial)
 *   mask  — vertical clip-wipe upward (assembly)
 *   clip  — horizontal clip-wipe from the reading edge (reveals like a swipe)
 *   left  — glide in from the left
 *   right — glide in from the right
 *   scale — settle in from slightly enlarged (progressive assembly)
 *   blur  — resolve out of a soft blur (dreamy focus pull)
 *
 * Same reduced-motion / no-JS contract as Reveal: content ships visible in SSR,
 * hidden pre-paint only when motion is allowed.
 */
type Variant = 'rise' | 'mask' | 'clip' | 'left' | 'right' | 'scale' | 'blur' | 'scaleBlur';

type SceneRevealProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  delay?: number;
  amount?: number;
  /**
   * Scroll-linked: the reveal tracks scroll progress (and reverses) instead of
   * firing once. Use only for decorative/visual elements — never body copy — so
   * text is never left half-revealed while reading.
   */
  scrub?: boolean;
};

function fromState(variant: Variant, dir: 'ltr' | 'rtl') {
  switch (variant) {
    case 'mask':
      return { autoAlpha: 0, yPercent: 12, clipPath: 'inset(0 0 100% 0)' };
    case 'clip':
      // Wipe from the reading edge — mirrors for RTL.
      return {
        autoAlpha: 1,
        clipPath: dir === 'rtl' ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
      };
    case 'left':
      return { autoAlpha: 0, x: -48 };
    case 'right':
      return { autoAlpha: 0, x: 48 };
    case 'scale':
      return { autoAlpha: 0, scale: 0.92 };
    case 'scaleBlur':
      // Settle in from slightly small AND out of focus — for hero headings.
      return { autoAlpha: 0, scale: 0.94, filter: 'blur(10px)' };
    case 'blur':
      return { autoAlpha: 0, filter: 'blur(14px)' };
    case 'rise':
    default:
      return { autoAlpha: 0, y: 28 };
  }
}

function toState(variant: Variant) {
  switch (variant) {
    case 'mask':
      return { autoAlpha: 1, yPercent: 0, clipPath: 'inset(0 0 0% 0)' };
    case 'clip':
      return { clipPath: 'inset(0 0% 0 0%)' };
    case 'left':
    case 'right':
      return { autoAlpha: 1, x: 0 };
    case 'scale':
      return { autoAlpha: 1, scale: 1 };
    case 'scaleBlur':
      return { autoAlpha: 1, scale: 1, filter: 'blur(0px)' };
    case 'blur':
      return { autoAlpha: 1, filter: 'blur(0px)' };
    case 'rise':
    default:
      return { autoAlpha: 1, y: 0 };
  }
}

export function SceneReveal({
  children,
  variant = 'rise',
  className,
  delay = 0,
  amount = 0.2,
  scrub = false,
}: SceneRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  useGSAP(
    () => {
      if (shouldReduce || !ref.current) return;
      const dir = ref.current.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
      gsap.fromTo(ref.current, fromState(variant, dir), {
        ...toState(variant),
        // Scrubbed reveals ignore duration (progress is scroll-driven); one-shot
        // reveals use the premium ease over a fixed duration.
        duration: variant === 'clip' || variant === 'mask' ? duration.slow : duration.medium,
        delay: scrub ? 0 : delay,
        ease: scrub ? 'none' : gsapEase.outSoft,
        scrollTrigger: scrub
          ? { trigger: ref.current, start: 'top 88%', end: 'top 45%', scrub: 0.6 }
          : { trigger: ref.current, start: `top ${100 - amount * 100}%`, once: true },
      });
    },
    { scope: ref, dependencies: [shouldReduce] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
