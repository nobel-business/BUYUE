'use client';

import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/motion/gsap';
import { Text } from '@/components/ui/Typography';
import styles from './ReadingParagraphs.module.css';

/**
 * About intro paragraphs as a reading experience (content verbatim — Doc 02 §2).
 *
 * Each paragraph brightens + sharpens as it enters the reading band and gently dims +
 * softens as it leaves, so the eye is always guided to the "active" line without any
 * pin. Scroll-linked (scrub) via one ScrollTrigger per paragraph, auto-cleaned by
 * useGSAP. Reduced motion → all paragraphs fully legible, no motion. Only opacity/
 * filter/transform animate.
 */
export function ReadingParagraphs({ paragraphs }: { paragraphs: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      if (reduce || !ref.current) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-para]', ref.current);
      // Cinematic reading focus, three states tied to the viewport centre:
      //   next (below, unread) → 30% opacity, 2px blur
      //   active (at centre)   → 100% opacity, 0 blur
      //   previous (above)     → 70% opacity, 1px blur (kept legible, not hidden)
      items.forEach((el) => {
        gsap.set(el, { autoAlpha: 0.3, filter: 'blur(2px)', y: 14 });
        gsap
          .timeline({
            scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 20%', scrub: 0.5 },
          })
          .to(el, { autoAlpha: 1, filter: 'blur(0px)', y: 0, ease: 'none', duration: 0.4 })
          .to(el, { autoAlpha: 1, duration: 0.25 })
          .to(el, { autoAlpha: 0.7, filter: 'blur(1px)', ease: 'none', duration: 0.4 });
      });
    },
    { scope: ref, dependencies: [reduce] },
  );

  return (
    <div ref={ref} className={styles.stack}>
      {paragraphs.map((paragraph, index) => (
        <Text
          key={index}
          data-para
          size={index === 0 ? 'body-l' : 'body'}
          tone={index === 0 ? 'primary' : 'secondary'}
        >
          {paragraph}
        </Text>
      ))}
    </div>
  );
}
