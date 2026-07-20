/**
 * Theme contract — shared by the no-flash boot script and the toggle so the
 * storage key and attribute can never drift apart.
 *
 * Dark is the baseline: it is what the server renders and what `:root` defines,
 * so "no stored preference" means no attribute at all rather than an explicit
 * `data-theme="dark"`. Light is the override (`:root[data-theme='light']`).
 */
export const THEME_STORAGE_KEY = 'buyue-theme';

export type Theme = 'light' | 'dark';

/**
 * Inlined into <body> as the first element. Deliberately tiny, dependency-free
 * and wrapped in try/catch — localStorage throws in private-mode Safari and
 * behind some cookie policies, and a theme preference is never worth breaking
 * the page over.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'){document.documentElement.setAttribute('data-theme','light')}}catch(e){}})();`;

/** Read the theme currently applied to the document. */
export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

/** Apply a theme to the document and remember it. */
export function setTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'light') root.setAttribute('data-theme', 'light');
  else root.removeAttribute('data-theme');
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage unavailable — the choice still applies for this session.
  }
}
