'use client';

import { useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from './gsap';

/**
 * Magnetic hover (Mission M4: magnetic buttons / refined interactions). The
 * wrapped element eases toward the pointer while hovered and springs back on
 * leave, using gsap.quickTo for a smooth, allocation-free follow.
 *
 * Guardrails: only on fine pointers (mouse/trackpad) — never on touch, where it
 * would fight taps — and fully disabled under reduced motion. Renders an inline
 * wrapper so it drops into flex/inline button rows without affecting layout.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const shouldReduce = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (shouldReduce || !el) return;
      if (!window.matchMedia('(pointer: fine)').matches) return;

      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        xTo(dx * strength);
        yTo(dy * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: ref, dependencies: [shouldReduce] },
  );

  return (
    <span ref={ref} className={className} style={{ display: 'inline-flex' }}>
      {children}
    </span>
  );
}
