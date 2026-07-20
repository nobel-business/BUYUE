import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils/cn';
import styles from './Skeleton.module.css';

type SkeletonProps = {
  width?: string;
  height?: string;
  radius?: 'sm' | 'md' | 'lg' | 'pill';
  className?: string;
};

/**
 * Loading placeholder (Doc 10 §40). Must be sized to match final content to
 * avoid CLS. Shimmer is disabled under reduced motion (via the global reset).
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  radius = 'md',
  className,
}: SkeletonProps) {
  const style: CSSProperties = {
    width,
    height,
    borderRadius: `var(--radius-${radius})`,
  };
  return <span className={cn(styles.skeleton, className)} style={style} aria-hidden="true" />;
}
