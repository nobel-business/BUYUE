'use client';

import { useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from './gsap';
import { duration, gsapEase, entranceDistance } from './tokens';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay in seconds. */
  delay?: number;
  /** Fraction of the element visible before firing (Doc 05 §7). */
  amount?: number;
};

/**
 * Canonical "fade + rise" entrance, fired once on scroll-into-view (Doc 05 §27).
 * GSAP + ScrollTrigger engine (Mission), same public API as before so pages are
 * unchanged. Content renders visible in the SSR HTML; the entrance is armed in a
 * layout effect (via useGSAP) BEFORE paint, so there is no flash — and under
 * reduced motion nothing is hidden at all (§33).
 */
export function Reveal({ children, className, delay = 0, amount = 0.2 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  useGSAP(
    () => {
      if (shouldReduce || !ref.current) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: entranceDistance },
        {
          opacity: 1,
          y: 0,
          duration: duration.medium,
          delay,
          ease: gsapEase.outSoft,
          scrollTrigger: {
            trigger: ref.current,
            // Fire when `amount` of the element has entered from the bottom.
            start: `top ${100 - amount * 100}%`,
            once: true,
          },
        },
      );
    },
    { scope: ref, dependencies: [shouldReduce] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
