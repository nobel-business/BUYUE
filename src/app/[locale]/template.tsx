'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Page-transition wrapper (Mission M4: premium page transitions). A template
 * re-mounts on every navigation, so each new page resolves out of a soft blur +
 * lift instead of a hard cut — reinforcing the "one continuous journey" feel.
 * Header/Footer live in the layout (outside this), so the chrome stays put while
 * only the page content transitions. Reduced motion → no transition.
 */
export default function Template({ children }: { children: ReactNode }) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
