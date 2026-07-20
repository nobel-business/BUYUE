import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Eyebrow, Heading, Text } from '@/components/typography/Typography';
import styles from './SectionHeader.module.css';

type SectionHeaderProps = {
  eyebrow?: ReactNode;
  heading: ReactNode;
  /** Semantic heading level (Doc 07 §13). Visual size follows unless overridden. */
  level?: 1 | 2 | 3;
  headingSize?: 'display' | 'h1' | 'h2' | 'h3';
  subheading?: ReactNode;
  align?: 'start' | 'center';
  className?: string;
};

/** Standard section-opening header: eyebrow + heading + subheading (Doc 09 §6, Doc 10 §37). */
export function SectionHeader({
  eyebrow,
  heading,
  level = 2,
  headingSize,
  subheading,
  align = 'start',
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn(styles.header, styles[`align-${align}`], className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading level={level} size={headingSize}>
        {heading}
      </Heading>
      {subheading && (
        <Text size="body-l" tone="secondary" className={styles.subheading}>
          {subheading}
        </Text>
      )}
    </header>
  );
}
