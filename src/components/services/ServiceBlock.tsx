import type { ReactNode } from 'react';
import { Heading, Text, Eyebrow } from '@/components/typography/Typography';
import styles from './ServiceBlock.module.css';

type ServiceBlockProps = {
  id?: string;
  index: number;
  title: ReactNode;
  intro: ReactNode;
  /** "ماذا نقدم؟" label — shown only for blocks that have it (Doc 02 §3.2). */
  offerLabel?: ReactNode;
  features: string[];
  valueLabel: ReactNode;
  value: ReactNode;
};

/**
 * A single service detail block (Doc 09 Page 3, Doc 10 §9). Editorial
 * two-column layout: large index + title / intro + features + value.
 * Data-driven — the same shape a future admin/CMS will supply (audit C-04).
 */
export function ServiceBlock({
  id,
  index,
  title,
  intro,
  offerLabel,
  features,
  valueLabel,
  value,
}: ServiceBlockProps) {
  return (
    <article id={id} className={styles.block}>
      <div className={styles.aside}>
        <span className={styles.index} aria-hidden="true">
          {String(index).padStart(2, '0')}
        </span>
        <Heading level={2} size="h3">
          {title}
        </Heading>
      </div>

      <div className={styles.content}>
        <Text tone="secondary" className={styles.intro}>
          {intro}
        </Text>

        <div className={styles.offer}>
          {offerLabel && <Eyebrow>{offerLabel}</Eyebrow>}
          <ul className={styles.features}>
            {features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className={styles.valueRow}>
          <Eyebrow>{valueLabel}</Eyebrow>
          <Text className={styles.value}>{value}</Text>
        </div>
      </div>
    </article>
  );
}
