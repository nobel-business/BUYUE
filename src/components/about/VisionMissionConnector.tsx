'use client';

import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/motion/gsap';
import styles from './VisionMissionConnector.module.css';

/**
 * A thin luminous line drawn in the gutter between the Vision and Mission cards: it
 * draws itself outward when the pair enters view, then breathes softly (a slow
 * fade), suggesting a living connection between the two. Decorative (aria-hidden),
 * desktop-only, transform/opacity only, disabled under reduced motion.
 */
export function VisionMissionConnector() {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduce || !el) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        gsap.fromTo(
          el,
          { scaleX: 0, autoAlpha: 0 },
          {
            scaleX: 1,
            autoAlpha: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            onComplete: () => {
              gsap.to(el, {
                autoAlpha: 0.3,
                duration: 2.6,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
              });
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [reduce] },
  );

  return <span ref={ref} className={styles.line} aria-hidden="true" />;
}
