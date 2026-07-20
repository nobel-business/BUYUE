'use client';

import { useState, type ReactNode } from 'react';
import { Icon } from '@/components/Icon/Icon';
import { cn } from '@/lib/cn';
import styles from './Accordion.module.css';

export type AccordionItem = { id: string; question: ReactNode; answer: ReactNode };

type AccordionProps = {
  items: AccordionItem[];
  /** Only one panel open at a time. */
  singleOpen?: boolean;
};

/**
 * Accessible disclosure list (Doc 10 §14–15). Powers FAQ blocks.
 * - Real <button> triggers with aria-expanded / aria-controls.
 * - Smooth height via animatable grid-template-rows (0fr → 1fr); the global
 *   reset makes it instant under reduced motion (Doc 05 §19).
 */
export function Accordion({ items, singleOpen = false }: AccordionProps) {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(singleOpen ? [] : prev);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={styles.accordion}>
      {items.map((item) => {
        const isOpen = open.has(item.id);
        const triggerId = `${item.id}-trigger`;
        const panelId = `${item.id}-panel`;
        return (
          <div key={item.id} className={styles.item}>
            <h3 className={styles.heading}>
              <button
                type="button"
                id={triggerId}
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span>{item.question}</span>
                <Icon name={isOpen ? 'minus' : 'plus'} size={20} className={styles.icon} />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(styles.panel, isOpen && styles.open)}
              inert={!isOpen}
            >
              <div className={styles.panelInner}>{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
