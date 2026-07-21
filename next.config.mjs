import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Security & performance response headers (Doc 07 §6, §7).
// NOTE: A full Content-Security-Policy is intentionally deferred until the
// analytics vendor, font hosting, and admin backend are chosen (audit C-02/C-09).
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Dev-only: allow the loopback IP as an origin so visiting the site at
  // http://127.0.0.1:3000 loads the /_next/* client chunks (otherwise Next treats
  // 127.0.0.1 and localhost as different origins and hydration silently fails —
  // the SSR HTML shows but client-only components like the hero canvas never mount).
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    // Doc 07 §14 — modern formats.
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
