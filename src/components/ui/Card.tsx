import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cn } from '@/lib/utils/cn';
import styles from './Card.module.css';

type CardProps = ComponentPropsWithoutRef<'div'> & {
  as?: ElementType;
  tone?: 'raised' | 'sunken' | 'accent' | 'inverse';
  padding?: 'none' | 'md' | 'lg';
  /** Adds hover lift + shadow. Use only when the whole card is a link/action. */
  interactive?: boolean;
};

/** Base surface primitive (Doc 03 §16, Doc 10 §7). Extended by feature/service/client cards. */
export function Card({
  as: Tag = 'div',
  tone = 'raised',
  padding = 'lg',
  interactive = false,
  className,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        styles.card,
        styles[`tone-${tone}`],
        styles[`padding-${padding}`],
        interactive && styles.interactive,
        className,
      )}
      {...rest}
    />
  );
}
