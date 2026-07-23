import { defineRouting } from 'next-intl/routing';

/**
 * Locale routing configuration.
 *
 * - English (`en`) is the DEFAULT entry language: every visitor lands in English
 *   regardless of their browser/OS language or location. `localeDetection: false`
 *   turns off Accept-Language negotiation, so `/` always redirects to `/en` for
 *   everyone (no browser-language / geo sniffing).
 * - Arabic (`ar`) stays fully supported — reachable at `/ar` and via the language
 *   switcher. (This overrides the Arabic-first default of Doc 01 / 07 §2 / 09 §27,
 *   per an explicit product decision to make English the default.)
 * - `localePrefix: 'always'` keeps both locales explicitly prefixed (/ar, /en) for
 *   unambiguous `hreflang` and canonical URLs (Doc 07 §7).
 */
export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: false,
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
