import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cn } from '@/lib/cn';
import styles from './Stack.module.css';

type StackProps = ComponentPropsWithoutRef<'div'> & {
  as?: ElementType;
  direction?: 'column' | 'row';
  gap?: '1' | '2' | '3' | '4' | '5' | '6' | '8';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
};

/** Flexbox stack with token-based gap. Uses logical flow so it mirrors in RTL. */
export function Stack({
  as: Tag = 'div',
  direction = 'column',
  gap = '4',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className,
  style,
  ...rest
}: StackProps) {
  return (
    <Tag
      className={cn(
        styles.stack,
        styles[`dir-${direction}`],
        styles[`align-${align}`],
        styles[`justify-${justify}`],
        wrap && styles.wrap,
        className,
      )}
      style={{ gap: `var(--space-${gap})`, ...style }}
      {...rest}
    />
  );
}
