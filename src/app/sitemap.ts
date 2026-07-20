import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/seo';

const paths = ['', '/about', '/services', '/clients', '/contact'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${base}/${locale}${path}`,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
    })),
  );
}
