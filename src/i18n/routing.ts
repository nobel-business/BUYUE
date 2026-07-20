import { defineRouting } from 'next-intl/routing';

/**
 * Locale routing configuration.
 *
 * - Arabic (`ar`) is the PRIMARY / default language (Doc 01, Doc 07 §2, Doc 09 §27).
 * - English (`en`) is the SECONDARY language, translated from Arabic (Doc 08) — content
 *   is produced and approved in a later phase (audit C-10).
 * - `localePrefix: 'always'` keeps both locales explicitly prefixed (/ar, /en) for
 *   unambiguous `hreflang` and canonical URLs (Doc 07 §7).
 */
export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];

/** Type-safe locale guard (reused by middleware, request config, and layout). */
export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (routing.locales as readonly string[]).includes(value);
}

/** Text direction per locale (Doc 09 §27–28). */
export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
};
