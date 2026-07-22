import { Link } from '@/i18n/navigation';
import { Heading, Text } from '@/components/ui/Typography';
import { Container } from '@/components/layout/Container';
import { buttonClasses } from '@/components/ui/Button';
import { SceneReveal } from '@/lib/motion/SceneReveal';
import { Magnetic } from '@/lib/motion/Magnetic';
import { clientLogos } from '@/lib/data/clientLogos';
import { ClientWallGrid } from './ClientWallGrid';
import styles from './ClientWall.module.css';

type ClientWallProps = {
  heading: string;
  subheading: string;
  body: string;
  cta: string;
};

/**
 * Clients — the full roster as one calm, legible logo wall on a light panel.
 *
 * WHY LIGHT: every asset in public/logos-trimmed is a full-colour mark drawn for
 * a white background (dark ink, saturated fills, several with knocked-out white
 * counters). On the site's near-black canvas they either disappear or need
 * per-logo inversion, which never survives contact with 30 real brand marks. The
 * wall therefore sits on its own warm off-white sheet — a deliberate light panel
 * in the palette's ivory family, not a hole punched in the page.
 *
 * Logos rest desaturated and lift to full colour on hover/focus, so the wall
 * reads as one material at a glance and rewards attention up close.
 *
 * There are no rules, tiles or boxes around the marks: the wall is organised by
 * rhythm alone — one fixed cell height shared by all 30, so a tall crest and a
 * wide wordmark occupy the same optical envelope, and a gap deep enough that two
 * neighbours can never read as a single lockup.
 *
 * Server component: no JS beyond the shared entrance reveal.
 */
export function ClientWall({ heading, subheading, body, cta }: ClientWallProps) {
  return (
    <section className={styles.section}>
      <Container>
        <SceneReveal variant="rise">
          <div className={styles.panel}>
            <div className={styles.head}>
              <Heading level={2} size="h2" className={styles.heading}>
                {heading}
              </Heading>
              <Text className={styles.subheading}>{subheading}</Text>
              <Text className={styles.body}>{body}</Text>
            </div>

            {/* Living logo wall — slots crossfade through the full roster on a
                timer (client component; see ClientWallGrid). The generic
                "Client logo" alt is dropped to "" there so a screen reader is not
                read ~20 identical labels; the list's aria-label carries meaning. */}
            <ClientWallGrid logos={clientLogos} label={subheading} />

            <div className={styles.foot}>
              <Magnetic>
                <Link href="/clients" className={buttonClasses('primary', 'lg')}>
                  {cta}
                </Link>
              </Magnetic>
            </div>
          </div>
        </SceneReveal>
      </Container>
    </section>
  );
}
