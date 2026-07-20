'use client';

import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/motion/gsap';
import { cn } from '@/lib/cn';
import styles from './AmbientBackground.module.css';

/**
 * Ambient decorative layer (approved decorative scope — brand palette only).
 * This is the SLOWEST depth layer: three soft brand washes drift on long organic
 * cycles, the whole field parallaxes gently with scroll (behind everything), and
 * their glow breathes with scroll velocity via a CSS var (`--sv`, set by the
 * smooth-scroll provider) — an almost-imperceptible "alive while moving" touch.
 *
 * Channel ownership (no conflicts): GSAP owns orb transforms (x/y/scale) and the
 * field's scroll drift; CSS owns orb opacity (velocity). Reduced motion → still,
 * dimmer washes, no scroll coupling.
 */
export function AmbientBackground() {
  const scope = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  useGSAP(
    () => {
      if (shouldReduce || !scope.current) return;
      const orbs = scope.current.querySelectorAll('[data-orb]');
      orbs.forEach((orb, i) => {
        // Slow organic drift — transforms only (opacity is CSS-owned).
        gsap.to(orb, {
          xPercent: i % 2 === 0 ? 6 : -6,
          yPercent: i % 2 === 0 ? -5 : 7,
          scale: 1.08,
          duration: 18 + i * 5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });

      // Depth: the whole field drifts a hair with page scroll — slowest layer.
      const field = scope.current.querySelector('[data-field]');
      if (field) {
        gsap.fromTo(
          field,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: document.body,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          },
        );
      }
    },
    { scope, dependencies: [shouldReduce] },
  );

  return (
    <div ref={scope} className={styles.ambient} aria-hidden="true">
      {/* Soft volumetric fog — the deepest warm wash, so it never reads flat black. */}
      <span className={styles.fog} />
      <div data-field className={styles.field}>
        <span data-orb className={cn(styles.orb, styles.orbA)} />
        <span data-orb className={cn(styles.orb, styles.orbB)} />
        <span data-orb className={cn(styles.orb, styles.orbC)} />
        <span data-orb className={cn(styles.orb, styles.orbD)} />
      </div>
      <div className={styles.particles}>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={styles.particle} />
        ))}
      </div>
      <span className={styles.grain} />
    </div>
  );
}
