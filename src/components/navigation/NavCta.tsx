'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icon } from '@/components/ui/Icon';
import { Magnetic } from '@/lib/motion/Magnetic';
import { contactItem } from '@/lib/config/nav';
import styles from './NavCta.module.css';

/**
 * Premium Contact CTA for the navbar. Rounded, brand-filled, with a soft brand
 * glow, hover elevation + slight scale, a sliding arrow, and a subtle magnetic
 * pull toward the cursor. Same route/behaviour as before (→ Contact).
 */
export function NavCta() {
  const t = useTranslations('nav');

  return (
    <Magnetic strength={0.28} className={styles.magnet}>
      <Link href={contactItem.href} className={styles.cta}>
        <span className={styles.label}>{t('contact')}</span>
        <span className={styles.arrow} aria-hidden="true">
          <Icon name="arrow-right" size={16} flipRtl />
        </span>
      </Link>
    </Magnetic>
  );
}
