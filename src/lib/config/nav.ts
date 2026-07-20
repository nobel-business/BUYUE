/**
 * Navigation configuration. Labels live in the message catalogue (nav.*),
 * so this holds only structure/routing. Hrefs are the final locale-relative
 * routes; each activates as its page phase lands (Doc 11).
 */
export type NavKey = 'home' | 'about' | 'services' | 'clients' | 'contact';

export type NavItem = { key: NavKey; href: string };

export const navItems: readonly NavItem[] = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'clients', href: '/clients' },
  { key: 'contact', href: '/contact' },
] as const;

/** The Contact item doubles as the persistent primary CTA (Doc 09 §9). */
export const contactItem: NavItem = { key: 'contact', href: '/contact' };

/** Items shown as plain links in the desktop bar (Contact is the CTA). */
export const primaryLinks: readonly NavItem[] = navItems.filter((item) => item.key !== 'contact');
