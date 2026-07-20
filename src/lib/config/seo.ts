import { routing } from '@/i18n/routing';

/**
 * Canonical site URL — the base for every canonical tag, hreflang alternate,
 * sitemap entry, OG url and the Organization JSON-LD.
 *
 * Resolution order, most to least specific:
 *
 * 1. `NEXT_PUBLIC_SITE_URL` — set this in Vercel once the real domain is
 *    confirmed. TODO(C-08): buyue.com vs buyue.sa is still unresolved.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` — injected automatically by Vercel at
 *    build time (host only, no scheme). This is the safety net: without it, a
 *    deploy with no env vars configured would publish `http://localhost:3000`
 *    into every canonical URL and sitemap entry, which search engines would
 *    index. It always resolves to the *production* host, so preview builds
 *    still emit production canonicals rather than advertising preview URLs.
 * 3. localhost — local development only.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) return `https://${vercelHost.replace(/\/+$/, '')}`;

  return 'http://localhost:3000';
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
