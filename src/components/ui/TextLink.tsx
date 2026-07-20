import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import styles from './TextLink.module.css';

type InternalHref = ComponentProps<typeof Link>['href'];

type TextLinkProps = {
  href: InternalHref;
  children: ReactNode;
  /** External links open in a new tab with safe rel + a11y hint. */
  external?: boolean;
  className?: string;
};

/**
 * Inline, locale-aware text link with an animated underline reveal (Doc 05 §30).
 * Internal links keep the active locale via next-intl's Link.
 */
export function TextLink({ href, children, external = false, className }: TextLinkProps) {
  if (external) {
    return (
      <a
        href={String(href)}
        className={cn(styles.link, className)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(styles.link, className)}>
      {children}
    </Link>
  );
}
