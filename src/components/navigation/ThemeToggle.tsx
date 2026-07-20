'use client';

import { useLayoutEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { getTheme, setTheme, type Theme } from '@/lib/config/theme';
import styles from './ThemeToggle.module.css';

/**
 * Light/dark switch for the nav bar.
 *
 * The button renders on the server in its dark-baseline state, then syncs to the
 * real theme on mount — the boot script may already have set `data-theme="light"`
 * from storage, which the server could not know. `suppressHydrationWarning` on the
 * label covers that one-frame difference; everything else is identical markup.
 *
 * Icon is the bronze metal accent from the palette (#BC7A3A), carried in both
 * modes: a sun when the next click gives you light, a moon when it gives you dark.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations('ui');
  const [theme, setThemeState] = useState<Theme>('dark');

  // useLayoutEffect, not useEffect: the boot script may already have applied
  // `data-theme="light"` before first paint, which the server could not know. A
  // passive effect runs AFTER paint, so a returning light-mode reader would see a
  // fully light page carrying the sun icon and "switch to light mode" — the exact
  // inverse of reality — until hydration caught up. This corrects it pre-paint.
  useLayoutEffect(() => {
    setThemeState(getTheme());
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    setThemeState(next);
  };

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(styles.toggle, className)}
      aria-label={isLight ? t('themeToDark') : t('themeToLight')}
      title={isLight ? t('themeToDark') : t('themeToLight')}
      suppressHydrationWarning
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {isLight ? (
          // Currently light → offer dark: a crescent.
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
        ) : (
          // Currently dark → offer light: a sun.
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M19.1 4.9l-1.5 1.5M6.4 17.6l-1.5 1.5" />
          </>
        )}
      </svg>
    </button>
  );
}
