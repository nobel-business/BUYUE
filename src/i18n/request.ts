import { getRequestConfig } from 'next-intl/server';
import { routing, isLocale } from './routing';

/**
 * Per-request i18n config. Loads the message catalogue for the active locale.
 *
 * Content note (Doc 02, Doc 07 §1): message catalogues are the ONLY place approved
 * copy lives, added verbatim per build phase. No content is invented here.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
