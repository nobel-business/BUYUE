import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Hero } from '@/components/sections/home/Hero';
import { WhyBuyue, type WhyItem } from '@/components/sections/home/WhyBuyue';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/ui/Typography';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ClientWall } from '@/components/sections/home/ClientWall';
import { buttonClasses } from '@/components/ui/Button';
import { SceneReveal } from '@/lib/motion/SceneReveal';
import { TextReveal } from '@/lib/motion/TextReveal';
import { Magnetic } from '@/lib/motion/Magnetic';
import { localeAlternates } from '@/lib/config/seo';
import styles from './home.module.css';

type PageParams = { params: Promise<{ locale: string }> };

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

      {/* Why Buyue — four ember-headed glass cards over a warm bloom. Renders its
          own <section>: the bloom needs the full-bleed band to spread across. */}
      <WhyBuyue heading={t('whyBuyue.heading')} items={whyItems} />

      {/* Our Clients — the full roster as a calm logo wall on a light panel. The
          marks are full-colour artwork drawn for white, so the panel is light in
          both themes; see ClientWall. The Clients page keeps the scroll-driven
          mosaic. */}
      <ClientWall
        heading={t('clientsTeaser.heading')}
        subheading={t('clientsTeaser.subheading')}
        body={t('clientsTeaser.body')}
        cta={t('clientsTeaser.cta')}
      />
    </main>
  );
}
