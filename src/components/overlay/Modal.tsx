'use client';

import { useId, type ReactNode } from 'react';
import { Overlay } from './Overlay';
import { Icon } from '@/components/ui/Icon';
import { Heading } from '@/components/ui/Typography';
import styles from './Dialog.module.css';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Localized accessible label for the close button (Doc 07 §1 — passed in, never invented). */
  closeLabel: string;
  children: ReactNode;
};

/** Centered dialog (Doc 10 §30). Focus-trapped + scroll-locked via Overlay. */
export function Modal({ isOpen, onClose, title, closeLabel, children }: ModalProps) {
  const titleId = useId();
  return (
    <Overlay isOpen={isOpen} onClose={onClose} labelledBy={titleId} variant="modal">
      <div className={styles.header}>
        <Heading level={2} size="h4" id={titleId}>
          {title}
        </Heading>
        <button type="button" className={styles.close} onClick={onClose} aria-label={closeLabel}>
          <Icon name="close" size={20} />
        </button>
      </div>
      <div className={styles.body}>{children}</div>
    </Overlay>
  );
}
