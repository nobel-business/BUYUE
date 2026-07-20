import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cn } from '@/lib/utils/cn';
import styles from './Section.module.css';

type SectionProps = ComponentPropsWithoutRef<'section'> & {
  as?: ElementType;
  /** Background/text role (Doc 03 §12–13). Alternate for editorial rhythm (Doc 09 §6). */
  tone?: 'page' | 'raised' | 'sunken' | 'accent' | 'inverse' | 'brand';
  /** Vertical rhythm (Doc 03 §5). */
  spacing?: 'default' | 'compact' | 'none';
};

/** Full-width page section with tone + vertical rhythm. */
export function Section({
  as: Tag = 'section',
  tone = 'page',
  spacing = 'default',
  className,
  ...rest
}: SectionProps) {
  return (
    <Tag
      className={cn(
        styles.section,
        styles[`tone-${tone}`],
        styles[`spacing-${spacing}`],
        className,
      )}
      {...rest}
    />
  );
}
