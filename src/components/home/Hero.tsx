import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/primitives/Container';
import { ButtonGroup } from '@/components/Button/ButtonGroup';
import { buttonClasses } from '@/components/Button/Button';
import { Heading, Text } from '@/components/typography/Typography';
import { Magnetic } from '@/lib/motion/Magnetic';
import { HeroReveal } from './HeroReveal';
import { cn } from '@/lib/utils/cn';
import styles from './Hero.module.css';

/**
 * Home hero (Doc 09 Page 1 §1.1, Doc 10 §4, Doc 05 §6).
 * Server component with a CSS-driven orchestrated entrance (best LCP, works
 * without JS, reduced-motion-safe). Visual is the brand geometric motif — no
 * photography asset is used (imagery pending). CTAs: primary → Contact,
 * secondary → Clients (Doc 01 §10–11).
 *
 * CONTENT NOTES:
 * - Arabic is verbatim from Doc 02 §1.1. The heading is a ⚠ VERIFY string —
 *   confirm against the original file before launch (audit H-14).
 * - English is PROVISIONAL (Doc 08 samples, audit C-10).
 */
export async function Hero() {
  const t = await getTranslations('home.hero');

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <HeroReveal>
        <span className={styles.motif} data-hero-motif aria-hidden="true" />
        <Container className={styles.inner} data-hero-inner>
          <Heading
            level={1}
            size="display"
            id="hero-heading"
            className={styles.heading}
            data-hero-heading
          >
            {t('heading')}
          </Heading>
          <Text size="body-l" tone="secondary" className={styles.body} data-hero-body>
            {t('body')}
          </Text>
          <ButtonGroup className={styles.actions} data-hero-actions>
            <Magnetic>
              <Link href="/contact" className={buttonClasses('primary', 'lg')}>
                {t('ctaPrimary')}
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/clients" className={cn(buttonClasses('secondary', 'lg'))}>
                {t('ctaSecondary')}
              </Link>
            </Magnetic>
          </ButtonGroup>
        </Container>
      </HeroReveal>
    </section>
  );
}
