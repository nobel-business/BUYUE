import { routing } from '@/i18n/routing';

/** Canonical site URL. TODO(C-08): confirm the production domain. */
export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
}

/**
 * Per-page canonical + hreflang alternates for bilingual SEO (Doc 07 §7).
 * `path` is the locale-relative route ('' for home, '/about', …).
 */
export function localeAlternates(locale: string, path: string) {
  const base = siteUrl();
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${base}/${l}${path}`;
  }
  return { canonical: `${base}/${locale}${path}`, languages };
}
