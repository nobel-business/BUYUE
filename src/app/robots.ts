import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Dev-only sandbox + API are not indexable content.
      disallow: ['/api/', '/ar/design-system', '/en/design-system'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
