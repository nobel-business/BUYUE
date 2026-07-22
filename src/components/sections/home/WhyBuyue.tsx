import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { SceneReveal } from '@/lib/motion/SceneReveal';
import { Stagger, StaggerItem } from '@/lib/motion/Stagger';
import { WhyMotif, type MotifVariant } from './WhyMotif';
import styles from './WhyBuyue.module.css';

export type WhyItem = { title: string; body: string };

/** Motif per card, in content order (Doc 09 — the four differentiators). The
 *  network lands on "We focus on results" and the radiating core on "across
 *  multiple channels": the busier motif sits beside the shortest copy, which is
 *  where the row has the most room to carry it. */
const VARIANTS: MotifVariant[] = ['wave', 'mesh', 'nodes', 'rings'];

/**
 * "Why choose Buyue?" — four smoked-glass cards in a row, each headed by its own
 * glowing ember motif, over a warm bloom on the page canvas.
 *
 * Replaces the generic FeatureCard grid for this section only; About's Values
 * stack still uses FeatureCard, so that shared component is untouched.
 *
 * The band is transparent and dresses itself from the `--scene-*` role tokens
 * rather than a hard-coded black, matching ClientLogoMosaic. On the default dark
 * theme that resolves to the deep near-black of the reference; in light theme the
 * ink and glass invert instead of stranding a black slab mid-page.
 *
 * `Stagger` is the row itself (it renders the flex container), so the cards are
 * its direct children and no wrapper sits between the grid and its items.
 */
export function WhyBuyue({ heading, items }: { heading: string; items: WhyItem[] }) {
  return (
    <Section tone="page" className={styles.section}>
      {/* Soft red-orange light bloom behind the row. */}
      <span className={styles.bloom} aria-hidden="true" />
      <Container>
        <SceneReveal variant="rise">
          <Heading level={2} size="h2" className={styles.heading}>
            {heading}
          </Heading>
        </SceneReveal>

        <Stagger className={styles.row}>
          {items.map((item, i) => (
            <StaggerItem key={i} className={styles.cell}>
              <article className={styles.card}>
                <span className={styles.art} aria-hidden="true">
                  <WhyMotif variant={VARIANTS[i] ?? 'wave'} />
                </span>
                <div className={styles.body}>
                  <Heading level={3} size="h4" className={styles.title}>
                    {item.title}
                  </Heading>
                  <Text tone="secondary" className={styles.copy}>
                    {item.body}
                  </Text>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
