'use client';

import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/motion/gsap';
import styles from './ScrollDivider.module.css';

/**
 * An elegant divider that draws itself as it enters view — a hairline that grows from
 * the centre outward with a soft travelling highlight. Decorative (aria-hidden).
 * Reduced motion → simply present. Transform/opacity only.
 */
export function ScrollDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduce || !el) return;
      const line = el.querySelector<HTMLElement>('[data-line]');
      if (!line) return;
      gsap.fromTo(
        line,
        { scaleX: 0, autoAlpha: 0 },
        {
          scaleX: 1,
          autoAlpha: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        },
      );
    },
    { scope: ref, dependencies: [reduce] },
  );

  return (
    <div ref={ref} className={styles.wrap} aria-hidden="true">
      <span data-line className={styles.line} />
    </div>
  );
}
