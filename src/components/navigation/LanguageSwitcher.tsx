'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { Magnetic } from '@/lib/motion/Magnetic';
import { cn } from '@/lib/utils/cn';
import styles from './LanguageSwitcher.module.css';

/** Language endonyms for accessible names. */
const endonym: Record<Locale, string> = { ar: 'العربية', en: 'English' };

/** Short glyph shown inside the circle — the code of the language it switches to. */
const glyph: Record<Locale, string> = { ar: 'ع', en: 'EN' };

type LanguageSwitcherProps = {
  className?: string;
  /** Retained for call-site compatibility; the single-circle control no longer
   *  needs a shared layout id, so it is unused. */
  idPrefix?: string;
};

/**
 * Single-circle language switch (Doc 10 §22).
 *
 * One round control sized and styled like the theme toggle beside it. It shows the
 * language it will switch TO (a sun-for-dark parallel: on an English page it shows
 * the Arabic glyph, on an Arabic page it shows "EN"), and clicking it navigates to
 * the other locale on the current path. The page-level blur/fade on navigation
 * (template) handles the language cross-fade. The capsule reacts to the cursor
 * (subtle magnetic) and carries a hover light-sweep.
 */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const active = useLocale();
  const pathname = usePathname();
  const t = useTranslations('ui');

  const target = (routing.locales.find((loc) => loc !== active) ?? active) as Locale;

  return (
    <Magnetic strength={0.18} className={cn(styles.magnet, className)}>
      <Link
        href={pathname}
        locale={target}
        hrefLang={target}
        aria-label={t('switchLanguage', { lang: endonym[target] })}
        title={t('switchLanguage', { lang: endonym[target] })}
        className={styles.circle}
      >
        <span className={styles.sweep} aria-hidden="true" />
        <span className={styles.text}>{glyph[target]}</span>
      </Link>
    </Magnetic>
  );
}
