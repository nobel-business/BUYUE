import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon, type IconName } from '@/components/Icon/Icon';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'on-dark-primary' | 'on-dark-secondary';

type CommonProps = {
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  iconStart?: IconName;
  iconEnd?: IconName;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof CommonProps> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof CommonProps> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Composes the button's visual classes for reuse on elements that must NOT be a
 * <button>/<a> (e.g. a locale-aware next-intl Link acting as a CTA). Keeps button
 * styling in one place (no duplication — Doc 07 §3).
 */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: 'md' | 'lg' = 'md',
  extra?: string,
): string {
  return cn(styles.button, styles[`variant-${variant}`], styles[`size-${size}`], extra);
}

/**
 * Button (Doc 03 §15, Doc 10 §5).
 * - `primary` uses the ACCESSIBLE action color (audit C-05): white on #c14b34 = 4.86:1.
 * - Renders <a> when `href` is provided, else <button>.
 * - Loading keeps width stable (no layout shift) and sets aria-busy.
 */
export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    iconStart,
    iconEnd,
    isLoading = false,
    fullWidth = false,
    children,
    className,
    ...rest
  } = props;

  const classes = cn(
    styles.button,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    fullWidth && styles.fullWidth,
    isLoading && styles.loading,
    className,
  );

  const content = (
    <>
      {iconStart && <Icon name={iconStart} size={size === 'lg' ? 22 : 20} flipRtl />}
      <span className={styles.label}>{children}</span>
      {iconEnd && <Icon name={iconEnd} size={size === 'lg' ? 22 : 20} flipRtl />}
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}
    </>
  );

  if (props.href !== undefined) {
    const { href, ...anchorRest } = rest as ComponentPropsWithoutRef<'a'>;
    return (
      <a href={href} className={classes} aria-busy={isLoading || undefined} {...anchorRest}>
        {content}
      </a>
    );
  }

  const { disabled, ...buttonRest } = rest as ComponentPropsWithoutRef<'button'>;
  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...buttonRest}
    >
      {content}
    </button>
  );
}
