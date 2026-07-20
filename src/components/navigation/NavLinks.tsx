'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { primaryLinks } from '@/lib/config/nav';
import { cn } from '@/lib/utils/cn';
import styles from './NavLinks.module.css';

type NavLinksProps = {
  variant?: 'horizontal' | 'stacked';
  onNavigate?: () => void;
};

/**
 * Shared nav links. In the desktop bar the active item is marked by a sliding
 * pill that glides between links via Framer layout animation (`layoutId`) — the
 * Header stays mounted across navigations, so the pill physically travels to the
 * new route. Hover adds a premium color shift, a micro-lift, and a centre-grown
 * underline. The stacked (mobile drawer) variant uses a simple active colour and
 * renders no pill (avoids a duplicate `layoutId`).
 */
export function NavLinks({ variant = 'horizontal', onNavigate }: NavLinksProps) {
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <ul className={cn(styles.list, styles[variant])}>
      {primaryLinks.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <li key={item.key} className={styles.item}>
            <Link
              href={item.href}
              className={cn(styles.link, active && styles.active)}
              aria-current={active ? 'page' : undefined}
              onClick={onNavigate}
            >
              {active && variant === 'horizontal' && (
                <motion.span
                  layoutId="navActivePill"
                  className={styles.pill}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <span className={styles.label}>{t(item.key)}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
