'use client';

import { useId, type ReactNode } from 'react';
import { Overlay } from './Overlay';
import { Icon } from '@/components/ui/Icon';
import styles from './Dialog.module.css';

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  closeLabel: string;
  /** Reading-start edge (right in RTL) by default — used by the mobile menu (Doc 05 §5). */
  side?: 'start' | 'end';
  title?: ReactNode;
  titleId?: string;
  children: ReactNode;
};

/** Edge drawer (Doc 10 §31). Slide direction mirrors for RTL via Overlay. */
export function Drawer({
  isOpen,
  onClose,
  closeLabel,
  side = 'start',
  title,
  children,
}: DrawerProps) {
  const generatedId = useId();
  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      variant="drawer"
      drawerSide={side}
      labelledBy={title ? generatedId : undefined}
    >
      <div className={styles.header}>
        {title && (
          <span id={generatedId} className={styles.drawerTitle}>
            {title}
          </span>
        )}
        <button type="button" className={styles.close} onClick={onClose} aria-label={closeLabel}>
          <Icon name="close" size={22} />
        </button>
      </div>
      <div className={styles.body}>{children}</div>
    </Overlay>
  );
}
