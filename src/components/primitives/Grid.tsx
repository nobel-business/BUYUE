import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils/cn';
import styles from './Grid.module.css';

type GridProps = ComponentPropsWithoutRef<'div'> & {
  /** Column count at desktop (collapses responsively). */
  columns?: 2 | 3 | 4;
  /** Gap token (Doc 03 §5). */
  gap?: 'sm' | 'md' | 'lg';
};

/** Responsive grid: `columns` at desktop → fewer on tablet → 1 on mobile (Doc 03 §6). */
export function Grid({ columns = 3, gap = 'md', className, ...rest }: GridProps) {
  return (
    <div
      className={cn(styles.grid, styles[`cols-${columns}`], styles[`gap-${gap}`], className)}
      {...rest}
    />
  );
}
