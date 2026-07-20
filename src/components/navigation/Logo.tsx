import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import styles from './Logo.module.css';

/**
 * Brand lockup → home: the real BUYUE geometric mark (public/brand) beside the
 * brand name. `data-nav-logo` marks the mark as the landing target for the intro's
 * FLIP hand-off (see Preloader). The visible name is the link's accessible label,
 * so no separate aria-label is needed; the mark's alt is empty (decorative here).
 */
export function Logo({ label, className }: { label: string; className?: string }) {
  return (
    <Link href="/" className={cn(styles.logo, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static brand mark, sized by CSS */}
      <img
        src="/brand/buyue-mark-trim.png"
        alt=""
        className={styles.mark}
        data-nav-logo
        draggable={false}
      />
      <span className={styles.name}>{label}</span>
    </Link>
  );
}
