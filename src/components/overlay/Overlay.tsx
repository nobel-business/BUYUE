'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/cn';
import { duration, easing } from '@/lib/motion/tokens';
import styles from './Overlay.module.css';

type OverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  describedBy?: string;
  variant?: 'modal' | 'drawer';
  drawerSide?: 'start' | 'end';
  className?: string;
};

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Accessible overlay primitive (Doc 10 §30–31). Powers Modal + Drawer.
 * Handles: portal, scrim, scroll-lock, focus trap, focus restore, ESC, and
 * RTL-correct slide direction. Motion collapses to a fade under reduced motion.
 */
export function Overlay({
  isOpen,
  onClose,
  children,
  labelledBy,
  describedBy,
  variant = 'modal',
  drawerSide = 'start',
  className,
}: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const getFocusable = () => {
      const panel = panelRef.current;
      if (!panel) return [] as HTMLElement[];
      return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
    };

    // Move focus into the dialog.
    const initial = getFocusable()[0] ?? panelRef.current;
    initial?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'Tab') {
        const items = getFocusable();
        const first = items[0];
        const last = items[items.length - 1];
        if (!first || !last) {
          event.preventDefault();
          return;
        }
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  const isRtl = document.dir === 'rtl';
  const startOff = isRtl ? '100%' : '-100%';
  const endOff = isRtl ? '-100%' : '100%';
  const off = drawerSide === 'start' ? startOff : endOff;

  const panelVariants =
    variant === 'drawer'
      ? { hidden: { x: off }, visible: { x: 0 }, exit: { x: off } }
      : {
          hidden: { opacity: 0, scale: 0.98, y: 12 },
          visible: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.98, y: 12 },
        };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className={styles.root}>
          <motion.div
            className={styles.scrim}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduce ? 0 : duration.base }}
          />
          <motion.div
            ref={panelRef}
            className={cn(
              styles.panel,
              variant === 'drawer' ? styles[`drawer-${drawerSide}`] : styles.modal,
              className,
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            tabIndex={-1}
            variants={shouldReduce ? undefined : panelVariants}
            initial={shouldReduce ? { opacity: 0 } : 'hidden'}
            animate={shouldReduce ? { opacity: 1 } : 'visible'}
            exit={shouldReduce ? { opacity: 0 } : 'exit'}
            transition={{ duration: shouldReduce ? 0 : duration.medium, ease: easing.outSoft }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
