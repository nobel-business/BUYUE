'use client';

import { Fragment, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from './gsap';
import { gsapEase } from './tokens';
import styles from './TextReveal.module.css';

/**
 * Word-by-word mask reveal for headings (Mission M3: text reveal identity).
 * Each word rises out of its own clip mask on a stagger. Splitting is on spaces
 * ONLY — never characters — so Arabic ligatures/shaping stay intact and RTL word
 * order is preserved by the container's own direction.
 *
 * Accessibility: the full text is present as real text (the spans are the words),
 * so it reads correctly to AT and search engines. Reduced motion / no-JS → the
 * words are simply visible with no transform.
 */
export function TextReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shouldReduce = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);

  useGSAP(
    () => {
      if (shouldReduce || !ref.current) return;
      const inners = ref.current.querySelectorAll('[data-word-inner]');
      gsap.fromTo(
        inners,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: gsapEase.outSoft,
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        },
      );
    },
    { scope: ref, dependencies: [shouldReduce] },
  );

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className={styles.word}>
            <span data-word-inner className={styles.inner}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  );
}
