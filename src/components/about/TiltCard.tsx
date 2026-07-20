'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/motion/gsap';
import { cn } from '@/lib/cn';
import styles from './TiltCard.module.css';

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees (brief: ≤ 3°). */
  max?: number;
  /** Idle vertical "breathing" drift (CSS on the perspective wrapper). */
  float?: boolean;
  /** A slow light sweep that crosses the card every few seconds on its own. */
  sweep?: boolean;
  /** Seconds of animation offset, so sibling cards drift/sweep out of phase. */
  delay?: number;
};

/**
 * Premium interactive card wrapper (About: Values + Vision/Mission).
 *
 * Fine-pointer only: the card tilts toward the cursor (≤ max° on each axis), lifts
 * and scales a touch on hover, and a soft light follows the pointer (CSS, via --mx/
 * --my). GSAP owns every transform (rotation, lift, scale) through quickTo so nothing
 * fights; glow / border / sweep are non-transform CSS. Touch, coarse pointers and
 * reduced motion get a calm static card. Transforms + opacity only → GPU-friendly.
 */
export function TiltCard({
  children,
  className,
  max = 3,
  float = false,
  sweep = false,
  delay = 0,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduce || !el || !window.matchMedia('(pointer: fine)').matches) return;

      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
      const sTo = gsap.quickTo(el, 'scale', { duration: 0.5, ease: 'power3' });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * max * 2);
        rx(-py * max * 2);
        el.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
        el.style.setProperty('--my', `${(py + 0.5) * 100}%`);
      };
      const onEnter = () => {
        yTo(-6);
        sTo(1.02);
      };
      const onLeave = () => {
        rx(0);
        ry(0);
        yTo(0);
        sTo(1);
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: ref, dependencies: [reduce] },
  );

  return (
    <div
      className={cn(styles.perspective, float && styles.float, sweep && styles.autoSweep)}
      style={{ '--tilt-delay': `${-delay}s` } as CSSProperties}
    >
      <div ref={ref} className={cn(styles.tilt, className)}>
        <span className={styles.sheen} aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
