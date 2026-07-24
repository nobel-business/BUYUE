import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { localeAlternates } from '@/lib/config/seo';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Grid } from '@/components/layout/Grid';
import { Stack } from '@/components/layout/Stack';
import { Heading, Text } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import type { AccordionItem } from '@/components/ui/Accordion';
import { FaqSection } from '@/components/sections/faq/FaqSection';
import { SceneReveal } from '@/lib/motion/SceneReveal';
import { TiltCard } from '@/components/sections/about/TiltCard';
import { ScrollDivider } from '@/components/sections/about/ScrollDivider';
import { AboutCinematicIntro } from '@/components/sections/about/AboutCinematicIntro';
import { ValuesScene } from '@/components/sections/about/ValuesScene';
import { VisionMissionConnector } from '@/components/sections/about/VisionMissionConnector';

type PageParams = { params: Promise<{ locale: string }> };

type ValueItem = { title: string; body: string };
type FaqEntry = { q: string; a: string };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about.meta' });
  return {
    title: { absolute: t('title') },
    description: t('description'),
    keywords: t('keywords'),
    alternates: localeAlternates(locale, '/about'),
  };
}

/**
 * About page (Doc 09 Page 2, Doc 02 §2). Arabic verbatim; English provisional
 * (C-10). Paragraph 3 contains a ⚠ VERIFY string rendered as supplied (H-14 family).
 */
export default async function AboutPage({ params }: PageParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  const paragraphs = t.raw('intro.paragraphs') as string[];
  const values = t.raw('values.items') as ValueItem[];
  const faqItems: AccordionItem[] = (t.raw('faq.items') as FaqEntry[]).map((entry, index) => ({
    id: `about-faq-${index}`,
    question: entry.q,
    answer: entry.a,
  }));

  return (
    <main id="main-content">
      {/* Intro — cinematic dark 3D hero (reference layout). Copy verbatim; scroll
          label and tagline are additive bilingual strings. */}
      <AboutCinematicIntro
        heading={t('intro.heading')}
        eyebrow={t('intro.eyebrow')}
        standfirst={t('intro.standfirst')}
        paragraphs={paragraphs}
      />

      <Container>
        <ScrollDivider />
      </Container>

      {/* Vision + Mission — premium panels: scale-in reveal + cursor tilt/float/glow */}
      <Section tone="page" spacing="compact">
        <Container>
          <div style={{ position: 'relative' }}>
            <Grid columns={2} gap="lg">
              <SceneReveal variant="left">
                <TiltCard float sweep delay={0}>
                  <Card tone="accent" padding="lg">
                    <Stack gap="3">
                      <Heading level={2} size="h3">
                        {t('vision.heading')}
                      </Heading>
                      <Text>{t('vision.body')}</Text>
                    </Stack>
                  </Card>
                </TiltCard>
              </SceneReveal>
              <SceneReveal variant="right" delay={0.1}>
                <TiltCard float sweep delay={3.5}>
                  <Card tone="inverse" padding="lg">
                    <Stack gap="3">
                      <Heading level={2} size="h3">
                        {t('mission.heading')}
                      </Heading>
                      <Text tone="secondary">{t('mission.body')}</Text>
                    </Stack>
                  </Card>
                </TiltCard>
              </SceneReveal>
            </Grid>
            <VisionMissionConnector />
          </div>
        </Container>
      </Section>

      <Container>
        <ScrollDivider />
      </Container>

      {/* Values — cinematic "chapter": a scroll-linked warm-gray curtain reveals a
          light glassmorphism scene, then reverses back to the dark theme on exit.
          Content verbatim. */}
      <ValuesScene heading={t('values.heading')} items={values} />

      {/* FAQ — shared premium glass scene (same on Services/Clients). Content verbatim. */}
      <FaqSection
        heading={t('faq.heading')}
        items={faqItems}
        ctaLabel={t('faq.cta')}
        ctaHref="/contact"
      />
    </main>
  );
}
