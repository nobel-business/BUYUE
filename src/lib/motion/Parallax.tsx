'use client';

import { useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from './gsap';
import { gsapEase } from './tokens';

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Max travel in px (kept small per Doc 05 §26). */
  offset?: number;
};

/**
 * Subtle scroll parallax, scrubbed 1:1 to scroll via GSAP ScrollTrigger
 * (Mission: tasteful parallax + scrub). Vertical-only, so it is RTL-safe.
 * Disabled entirely under reduced motion (Doc 05 §26, §33).
 */
export function Parallax({ children, className, offset = 40 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  useGSAP(
    () => {
      if (shouldReduce || !ref.current) return;
      gsap.fromTo(
        ref.current,
        { y: offset },
        {
          y: -offset,
          ease: gsapEase.linear,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
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
