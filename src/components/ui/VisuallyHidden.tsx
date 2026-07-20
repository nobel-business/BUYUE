import type { ComponentPropsWithoutRef, ElementType } from 'react';
import styles from './VisuallyHidden.module.css';

type VisuallyHiddenProps = ComponentPropsWithoutRef<'span'> & { as?: ElementType };

/** Visually hidden but available to assistive tech (Doc 07 §5). */
export function VisuallyHidden({ as: Tag = 'span', ...rest }: VisuallyHiddenProps) {
  return <Tag className={styles.visuallyHidden} {...rest} />;
}
