import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cn } from '@/lib/utils/cn';
import styles from './Container.module.css';

type ContainerProps = ComponentPropsWithoutRef<'div'> & {
  as?: ElementType;
  /** Max width preset (Doc 03 §7). */
  size?: 'default' | 'wide' | 'narrow';
};

/** Centered, gutter-aware content container (Doc 03 §7, Doc 09 §16). */
export function Container({
  as: Tag = 'div',
  size = 'default',
  className,
  ...rest
}: ContainerProps) {
  return <Tag className={cn(styles.container, styles[size], className)} {...rest} />;
}
