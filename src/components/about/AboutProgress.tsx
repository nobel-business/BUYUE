'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/motion/gsap';
import styles from './AboutProgress.module.css';

/**
 * A slim vertical reading-progress rail for the About page: a thin brand-tinted
 * fill grows from top to bottom as the reader moves through the page, scrubbed 1:1
 * to scroll via one ScrollTrigger over the main content. Decorative (aria-hidden);
 * the document already exposes real progress semantics elsewhere. Transform-only
 * (scaleY). Hidden on small screens and under reduced motion (CSS).
 *
 * Portalled to <body>: the page sits inside `app/[locale]/template.tsx`, a Framer
 * `motion.div` that animates `y` + `filter`. Either property makes that wrapper the
 * containing block for `position: fixed` descendants, so in the normal tree the
 * rail's `inset-block: 20vh` resolved against the full PAGE height instead of the
 * viewport — a page-tall rail that scrolled away with the content rather than
 * staying pinned. Rendering outside that wrapper restores viewport-fixed behaviour.
 */
export function AboutProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Portals need a DOM target, so the rail is client-only. It is decorative, so
  // omitting it from the SSR markup costs nothing and avoids a hydration mismatch.
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useGSAP(
    () => {
      const el = ref.current;
      if (reduce || !el) return;
      const fill = el.querySelector<HTMLElement>('[data-fill]');
      const main = document.getElementById('main-content');
      if (!fill || !main) return;
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: main, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
        },
      );
    },
    // `mounted` gates the portal, so the ref is only populated on the second pass —
    // rerun then, or the ScrollTrigger would never be built.
    { scope: ref, dependencies: [reduce, mounted] },
  );

  if (!mounted) return null;

  return createPortal(
    <div ref={ref} className={styles.rail} aria-hidden="true">
      <span data-fill className={styles.fill} />
    </div>,
    document.body,
  );
}
