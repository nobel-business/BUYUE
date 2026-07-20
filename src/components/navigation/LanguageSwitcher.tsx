'use client';

import { motion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { Magnetic } from '@/lib/motion/Magnetic';
import { cn } from '@/lib/utils/cn';
import styles from './LanguageSwitcher.module.css';

/** Language endonyms for accessible names. */
const endonym: Record<Locale, string> = { ar: 'العربية', en: 'English' };

type LanguageSwitcherProps = {
  className?: string;
  /** Distinguishes the layout indicator when two instances render at once
   *  (header + mobile drawer) so they don't share a `layoutId`. */
  idPrefix?: string;
};

/**
 * Morphing language switcher — a luxury segmented control (Doc 10 §22).
 * The active pill glides between AR / EN via Framer layout animation, carries a
 * soft brand glow + a hover light-sweep, and the whole capsule reacts to the
 * cursor (subtle magnetic). Switching preserves the current path; the page-level
 * blur/fade on navigation (template) handles the language cross-fade.
 */
export function LanguageSwitcher({ className, idPrefix = 'nav' }: LanguageSwitcherProps) {
  const active = useLocale();
  const pathname = usePathname();
  const t = useTranslations('ui');

  return (
    <Magnetic strength={0.18} className={cn(styles.magnet, className)}>
      <div className={styles.switcher} role="group" aria-label={t('language')}>
        {routing.locales.map((loc) => {
          const isActive = loc === active;
          return (
            <Link
              key={loc}
              href={pathname}
              locale={loc}
              hrefLang={loc}
              aria-label={endonym[loc]}
              aria-current={isActive ? 'true' : undefined}
              className={cn(styles.option, isActive && styles.optionActive)}
            >
              {isActive && (
                <motion.span
                  layoutId={`${idPrefix}-langPill`}
                  className={styles.pill}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className={styles.sweep} aria-hidden="true" />
                </motion.span>
              )}
              <span className={styles.text}>{loc.toUpperCase()}</span>
            </Link>
          );
        })}
      </div>
    </Magnetic>
  );
}
