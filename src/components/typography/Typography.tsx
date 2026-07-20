import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cn } from '@/lib/cn';
import styles from './Typography.module.css';

/* ── Heading ─────────────────────────────────────────────────────────────────
   Semantic level (h1–h4) is decoupled from visual size so hierarchy stays
   correct while visuals stay flexible (Doc 07 §13). */
type HeadingProps = ComponentPropsWithoutRef<'h2'> & {
  level?: 1 | 2 | 3 | 4;
  size?: 'display' | 'h1' | 'h2' | 'h3' | 'h4';
  weight?: 'medium' | 'bold';
  balance?: boolean;
};

export function Heading({
  level = 2,
  size,
  weight = 'bold',
  balance = true,
  className,
  ...rest
}: HeadingProps) {
  const Tag = `h${level}` as ElementType;
  const visualSize = size ?? (`h${level}` as HeadingProps['size']);
  return (
    <Tag
      className={cn(
        styles.heading,
        styles[`size-${visualSize}`],
        styles[`weight-${weight}`],
        balance && styles.balance,
        className,
      )}
      {...rest}
    />
  );
}

/* ── Text ────────────────────────────────────────────────────────────────── */
type TextProps = ComponentPropsWithoutRef<'p'> & {
  as?: ElementType;
  size?: 'body-l' | 'body' | 'small';
  tone?: 'primary' | 'secondary' | 'muted';
};

export function Text({
  as: Tag = 'p',
  size = 'body',
  tone = 'primary',
  className,
  ...rest
}: TextProps) {
  return (
    <Tag
      className={cn(styles.text, styles[`size-${size}`], styles[`tone-${tone}`], className)}
      {...rest}
    />
  );
}

/* ── Eyebrow (overline) ──────────────────────────────────────────────────── */
type EyebrowProps = ComponentPropsWithoutRef<'span'>;

export function Eyebrow({ className, ...rest }: EyebrowProps) {
  return <span className={cn(styles.eyebrow, className)} {...rest} />;
}
