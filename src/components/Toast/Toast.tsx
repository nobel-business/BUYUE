'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Icon, type IconName } from '@/components/Icon/Icon';
import { duration, easing } from '@/lib/motion/tokens';
import styles from './Toast.module.css';

type ToastVariant = 'success' | 'error' | 'info';
type Toast = { id: number; message: string; variant: ToastVariant; duration: number };

type ToastContextValue = {
  /** Push a toast. `message` is caller-supplied localized text (never invented). */
  addToast: (message: string, variant?: ToastVariant, duration?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const iconFor: Record<ToastVariant, IconName> = {
  success: 'check',
  error: 'alert-circle',
  info: 'info',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idCounter = useRef(0);
  const shouldReduce = useReducedMotion();

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = 'info', ttl = 5000) => {
      idCounter.current += 1;
      const id = idCounter.current;
      setToasts((current) => [...current, { id, message, variant, duration: ttl }]);
      window.setTimeout(() => removeToast(id), ttl);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className={styles.viewport} aria-live="polite" aria-atomic="false">
            <AnimatePresence>
              {toasts.map((toast) => (
                <motion.div
                  key={toast.id}
                  className={styles.toast}
                  role={toast.variant === 'error' ? 'alert' : 'status'}
                  data-variant={toast.variant}
                  initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  transition={{ duration: shouldReduce ? 0 : duration.base, ease: easing.outSoft }}
                >
                  <Icon name={iconFor[toast.variant]} size={20} className={styles.icon} />
                  <span>{toast.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>.');
  }
  return context;
}
