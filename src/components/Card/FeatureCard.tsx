import type { ReactNode } from 'react';
import { Card } from './Card';
import { Heading, Text } from '@/components/typography/Typography';
import { cn } from '@/lib/utils/cn';
import styles from './FeatureCard.module.css';

type FeatureCardProps = {
  title: ReactNode;
  children: ReactNode;
  /** Optional ordinal shown as an accent (e.g. values, differentiators). */
  index?: number;
  className?: string;
};

/**
 * Feature / value / differentiator card (Doc 10 §8). Title + body, minimal
 * chrome. Reused for About "Values" and Home "Why Buyue".
 */
export function FeatureCard({ title, children, index, className }: FeatureCardProps) {
  return (
    <Card tone="raised" padding="lg" className={cn(styles.card, className)}>
      {index !== undefined && (
        <span className={styles.index} aria-hidden="true">
          {String(index).padStart(2, '0')}
        </span>
      )}
      <Heading level={3} size="h4">
        {title}
      </Heading>
      <Text tone="secondary">{children}</Text>
    </Card>
  );
}
