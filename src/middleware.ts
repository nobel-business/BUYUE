import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Locale redirect (/ → /en). Detection is off in `routing`, so the browser's
// Accept-Language / location never changes the default. See Doc 09 §27–28.
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except API routes, Next internals, and static files.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
