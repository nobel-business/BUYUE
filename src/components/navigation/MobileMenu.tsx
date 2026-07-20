'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Drawer } from '@/components/overlay/Drawer';
import { Icon } from '@/components/Icon/Icon';
import { buttonClasses } from '@/components/Button/Button';
import { contactItem } from '@/lib/config/nav';
import { NavLinks } from './NavLinks';
import { LanguageSwitcher } from './LanguageSwitcher';
import styles from './MobileMenu.module.css';

/** Mobile hamburger → focus-trapped Drawer (Doc 05 §5, Doc 10 §3). */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const tNav = useTranslations('nav');
  const tUi = useTranslations('ui');

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label={tUi('openMenu')}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Icon name="menu" size={24} />
      </button>

      <Drawer
        isOpen={open}
        onClose={() => setOpen(false)}
        closeLabel={tUi('closeMenu')}
        side="start"
        title={tUi('brandName')}
      >
        <nav aria-label={tUi('primaryNav')} className={styles.nav}>
          <NavLinks variant="stacked" onNavigate={() => setOpen(false)} />
        </nav>
        <Link
          href={contactItem.href}
          className={buttonClasses('primary', 'lg', styles.cta)}
          onClick={() => setOpen(false)}
        >
          {tNav('contact')}
        </Link>
        <LanguageSwitcher className={styles.switcher} idPrefix="drawer" />
      </Drawer>
    </>
  );
}
