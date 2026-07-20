import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils/cn';
import styles from './ButtonGroup.module.css';

type ButtonGroupProps = ComponentPropsWithoutRef<'div'> & {
  /** Stacks to a column on mobile with the primary first (Doc 10 §6). */
  orientation?: 'horizontal' | 'stacked';
  align?: 'start' | 'center' | 'end';
};

export function ButtonGroup({
  orientation = 'horizontal',
  align = 'start',
  className,
  ...rest
}: ButtonGroupProps) {
  return (
    <div
      className={cn(styles.group, styles[orientation], styles[`align-${align}`], className)}
      {...rest}
    />
  );
}
