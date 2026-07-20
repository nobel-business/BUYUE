import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, isLocale, localeDirection } from '@/i18n/routing';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { SmoothScrollProvider } from '@/lib/motion/SmoothScrollProvider';
import { Preloader } from '@/components/motion/Preloader';
import { AmbientBackground } from '@/components/motion/AmbientBackground';
import { THEME_INIT_SCRIPT } from '@/lib/config/theme';
import { siteUrl } from '@/lib/config/seo';
// Global styles, imported in cascade order (reset → tokens → globals).
import '@/styles/reset.css';
import '@/styles/tokens.css';
import '@/styles/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Base metadata. Page-level titles/descriptions/keywords (verbatim from Doc 02)
 * are added per page in later phases. `metadataBase` resolves through
 * `siteUrl()` so the base URL has a single source of truth shared with the
 * canonical/hreflang helpers, the sitemap and robots.txt.
 * TODO(C-08): confirm canonical production domain.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    // The default title is intentionally the brand token only; no marketing
    // copy is invented here (Doc 07 §1). Page titles come from Doc 02.
    default: 'Buyue',
    template: '%s — Buyue',
  },
  openGraph: {
    type: 'website',
    siteName: 'Buyue',
    // TODO(C-11): add a branded OG image once assets are available.
  },
  twitter: { card: 'summary_large_image' },
};

/** Site-wide Organization structured data (Doc 07 §7). Kept minimal — address/
 *  phone/parent-name deferred until confirmed (audit C-08). */
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Buyue',
  url: siteUrl(),
  areaServed: ['SA', 'EG'],
};

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  // Enable static rendering for this locale.
  setRequestLocale(locale);

  const dir = localeDirection[locale];
  const messages = await getMessages();
  const t = await getTranslations('ui');

  return (
    <html lang={locale} dir={dir}>
      <body>
        {/* Theme, applied before first paint. Runs synchronously as the parser
            reaches it — ahead of any painted content — so a returning light-mode
            reader never sees a flash of the dark baseline. Dark stays the default
            when nothing is stored, matching the SSR markup. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Ambient decorative wash (behind everything) + intro cover. */}
          <AmbientBackground />
          {/* Premium intro cover — plays once (first visit), reveals into the hero. */}
          <Preloader />
          {/* Skip-to-content link (Doc 07 §5, Doc 09 §26). */}
          <a className="skip-link" href="#main-content">
            {t('skipToContent')}
          </a>
          <SmoothScrollProvider>
            <Header />
            {children}
            <Footer />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
