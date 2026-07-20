import { Grid } from '@/components/primitives/Grid';
import { Card } from '@/components/Card/Card';
import { Text } from '@/components/typography/Typography';
import styles from './Testimonials.module.css';

export type Testimonial = { id: string; quote: string; author: string; role?: string };

/**
 * Client testimonials (Doc 10 §12). Data-driven and admin-managed (C-04).
 * No source testimonials exist yet (audit H-06), so with an empty list this
 * renders NOTHING — no fabricated quotes. It activates when content is added.
 */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <Grid columns={3} gap="md">
      {items.map((item) => (
        <Card key={item.id} tone="raised" padding="lg">
          <blockquote className={styles.quote}>
            <Text>{item.quote}</Text>
            <footer className={styles.author}>
              <span className={styles.name}>{item.author}</span>
              {item.role && <span className={styles.role}>{item.role}</span>}
            </footer>
          </blockquote>
        </Card>
      ))}
    </Grid>
  );
}
