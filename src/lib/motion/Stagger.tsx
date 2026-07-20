'use client';

import { useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from './gsap';
import { duration, gsapEase, entranceDistance, staggerStep } from './tokens';

type StaggerProps = {
  children: ReactNode;
  className?: string;
  amount?: number;
  /**
   * `default` — rise + scale (calm depth).
   * `depth3d` — each item hinges up from a slight backward tilt and resolves out of
   *   a soft blur (rotateX + y + blur), for a more three-dimensional card assembly.
   */
  variant?: 'default' | 'depth3d';
};

/**
 * Orchestrates a group of `StaggerItem`s into a coordinated entrance (Doc 05
 * §29). GSAP engine (Mission): the container drives every child marked with
 * `data-stagger-item`, so the intelligent stagger timing lives in one place and
 * children stay plain markup. Reduced-motion → children render statically.
 */
export function Stagger({ children, className, amount = 0.2, variant = 'default' }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  useGSAP(
    () => {
      if (shouldReduce || !ref.current) return;
      const items = ref.current.querySelectorAll('[data-stagger-item]');
      if (items.length === 0) return;
      // Depth: children rise from slightly back (scale) as well as up, so the
      // group assembles with dimension rather than a flat fade (Mission M3:
      // "stagger with depth"). `from` + power ramp gives an accelerating cascade.
      const from =
        variant === 'depth3d'
          ? {
              autoAlpha: 0,
              y: entranceDistance,
              rotateX: -14,
              filter: 'blur(6px)',
              transformPerspective: 700,
              transformOrigin: 'center bottom',
            }
          : { autoAlpha: 0, y: entranceDistance, scale: 0.96 };
      const to =
        variant === 'depth3d'
          ? { autoAlpha: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }
          : { autoAlpha: 1, y: 0, scale: 1 };
      gsap.fromTo(items, from, {
        ...to,
        duration: duration.medium,
        ease: gsapEase.outSoft,
        stagger: { each: staggerStep, from: 'start' },
        scrollTrigger: {
          trigger: ref.current,
          start: `top ${100 - amount * 100}%`,
          once: true,
        },
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

/** A single stagger child. Marked for the parent `Stagger` to animate. */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-stagger-item className={className}>
      {children}
    </div>
  );
}
