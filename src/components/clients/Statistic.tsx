'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import styles from './Statistic.module.css';

type StatisticProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  label?: ReactNode;
};

/**
 * Animated statistic / counter (Doc 10 §11). Counts up once when scrolled into
 * view. The final value is always in the DOM (SSR renders it) so it is correct
 * without JS and readable by assistive tech; reduced motion skips the count.
 */
export function Statistic({ value, prefix, suffix, label }: StatisticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const shouldReduce = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (shouldReduce || !inView) return;
    let raf = 0;
    const duration = 700;
    const start = performance.now();
    setDisplay(0);
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, shouldReduce, value]);

  return (
    <div ref={ref} className={styles.stat}>
      <span className={styles.number}>
        {prefix}
        {display}
        {suffix}
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
