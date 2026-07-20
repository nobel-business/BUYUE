import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import { cn } from '@/lib/cn';
import styles from './Image.module.css';

type AppImageProps = Omit<NextImageProps, 'fill'> & {
  /** CSS aspect-ratio (e.g. "16 / 9"). When set, the image fills a ratio box. */
  ratio?: string;
  rounded?: 'none' | 'md' | 'lg';
  /** Applies a brand-color scrim for legible reversed text (Doc 03 §20). */
  overlay?: boolean;
};

/**
 * Responsive image primitive (Doc 10 §35). Wraps next/image (AVIF/WebP, lazy,
 * dimension-reserved → no CLS). `alt` is required by the type for accessibility.
 */
export function Image({
  ratio,
  rounded = 'none',
  overlay = false,
  className,
  alt,
  ...rest
}: AppImageProps) {
  if (ratio) {
    return (
      <span
        className={cn(
          styles.frame,
          styles[`rounded-${rounded}`],
          overlay && styles.overlay,
          className,
        )}
        style={{ aspectRatio: ratio }}
      >
        <NextImage alt={alt} fill className={styles.img} {...rest} />
      </span>
    );
  }
  return <NextImage alt={alt} className={cn(styles[`rounded-${rounded}`], className)} {...rest} />;
}
