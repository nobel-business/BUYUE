import { cn } from '@/lib/utils/cn';
import styles from './ProjectGallery.module.css';

/**
 * Project gallery (Doc 10 §34, Doc 02 §4.3). Real project images are pending
 * (audit C-11), so this renders the approved category labels as premium
 * placeholder tiles — honest category cards, not fake photography. When images
 * are supplied (admin-managed, C-04), each tile becomes a real gallery.
 */
export function ProjectGallery({ categories }: { categories: string[] }) {
  return (
    <ul className={styles.grid}>
      {categories.map((category, index) => (
        <li key={category} className={cn(styles.tile, styles[`tint-${index % 4}`])}>
          <span className={styles.label}>{category}</span>
        </li>
      ))}
    </ul>
  );
}
