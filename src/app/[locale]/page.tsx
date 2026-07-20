import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Hero } from '@/components/home/Hero';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Grid } from '@/components/primitives/Grid';
import { Text } from '@/components/typography/Typography';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { FeatureCard } from '@/components/Card/FeatureCard';
import { ClientLogoMosaic } from '@/components/clients/ClientLogoMosaic';
import { buttonClasses } from '@/components/Button/Button';
import { SceneReveal } from '@/lib/motion/SceneReveal';
import { TextReveal } from '@/lib/motion/TextReveal';
import { Stagger, StaggerItem } from '@/lib/motion/Stagger';
import { Magnetic } from '@/lib/motion/Magnetic';
import { localeAlternates } from '@/lib/config/seo';
import styles from './home.module.css';

type PageParams = { params: Promise<{ locale: string }> };
type WhyItem = { title: string; body: string };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.meta' });
  return {
    title: { absolute: t('title') },
    description: t('description'),
    keywords: t('keywords'),
    alternates: localeAlternates(locale, ''),
  };
}

/**
 * Home page (Doc 09 Page 1). Hero + services teaser + why-buyue + clients teaser.
 * All Arabic verbatim (Doc 02 §1); English provisional (C-10).
 */
export default async function Home({ params }: PageParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const serviceFeatures = t.raw('servicesTeaser.features') as string[];
  const whyItems = t.raw('whyBuyue.items') as WhyItem[];

  return (
    <main id="main-content">
      <Hero />

      {/* Services teaser — identity: word-by-word heading reveal + clip-wipe list */}
      <Section tone="page">
        <Container>
          <Stack gap="6">
            <SectionHeader
              heading={<TextReveal text={t('servicesTeaser.heading')} />}
              subheading={t('servicesTeaser.subheading')}
              level={2}
            />
            <SceneReveal variant="left">
              <Text tone="secondary" style={{ maxInlineSize: '65ch' }}>
                {t('servicesTeaser.body')}
              </Text>
            </SceneReveal>
            <SceneReveal variant="clip" scrub>
              <ul className={styles.serviceList}>
                {serviceFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </SceneReveal>
            <div>
              <Magnetic>
                <Link href="/services" className={buttonClasses('primary', 'lg')}>
                  {t('servicesTeaser.cta')}
                </Link>
              </Magnetic>
            </div>
          </Stack>
        </Container>
      </Section>

      {/* Why Buyue — identity: calm rise + depth stagger on the cards */}
      <Section tone="sunken">
        <Container>
          <Stack gap="6">
            <SceneReveal variant="rise">
              <SectionHeader heading={t('whyBuyue.heading')} level={2} />
            </SceneReveal>
            <Stagger>
              <Grid columns={2} gap="md">
                {whyItems.map((item, index) => (
                  <StaggerItem key={index}>
                    <FeatureCard title={item.title} index={index + 1}>
                      {item.body}
                    </FeatureCard>
                  </StaggerItem>
                ))}
              </Grid>
            </Stagger>
          </Stack>
        </Container>
      </Section>

      {/* Our Clients — scroll-driven gallery on a permanently dark band. Renders its
          own <section>: no Section/Container wrapper, so the band is full-bleed and
          the logo wall owns a wider stage + its own gutters. */}
      <ClientLogoMosaic
        heading={t('clientsTeaser.heading')}
        subheading={t('clientsTeaser.subheading')}
      />
    </main>
  );
}
