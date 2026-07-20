import { cn } from '@/lib/utils/cn';
import styles from './Icon.module.css';

/** Baseline geometric line-icon set (Doc 03 §18). Extend as components need. */
export const iconPaths = {
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
  'arrow-up': 'M12 19V5M6 11l6-6 6 6',
  'chevron-down': 'M6 9l6 6 6-6',
  'chevron-right': 'M9 6l6 6-6 6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  check: 'M4 12l5 5L20 6',
  close: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  'alert-circle': 'M12 8v5M12 16h.01M12 3a9 9 0 100 18 9 9 0 000-18z',
  info: 'M12 11v5M12 8h.01M12 3a9 9 0 100 18 9 9 0 000-18z',
} as const;

export type IconName = keyof typeof iconPaths;

type IconProps = {
  name: IconName;
  size?: number;
  /** Mirror horizontally in RTL (for directional icons like arrows). */
  flipRtl?: boolean;
  /** Accessible label. Omit for purely decorative icons (default: hidden from AT). */
  label?: string;
  className?: string;
};

export function Icon({ name, size = 24, flipRtl = false, label, className }: IconProps) {
  const decorative = !label;
  return (
    <svg
      className={cn(styles.icon, flipRtl && styles.flip, className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : 'img'}
      aria-label={label}
      focusable="false"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
