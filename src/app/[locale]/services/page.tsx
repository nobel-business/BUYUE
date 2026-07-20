import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { localeAlternates } from '@/lib/seo';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Heading } from '@/components/typography/Typography';
import type { AccordionItem } from '@/components/Accordion/Accordion';
import { FaqSection } from '@/components/faq/FaqSection';
import { ServicesStack } from '@/components/services/ServicesStack';
import { TextReveal } from '@/lib/motion/TextReveal';
import { ReadingParagraphs } from '@/components/about/ReadingParagraphs';

type PageParams = { params: Promise<{ locale: string }> };

type ServiceBlockData = {
  title: string;
  intro: string;
  hasOffer: boolean;
  features: string[];
  value: string;
};
type FaqEntry = { q: string; a: string };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services.meta' });
  return {
    title: { absolute: t('title') },
    description: t('description'),
    keywords: t('keywords'),
    alternates: localeAlternates(locale, '/services'),
  };
}

/**
 * Services page (Doc 09 Page 3, Doc 02 §3). Renders the 10 service blocks from a
 * structured, data-driven array — the same shape a future admin/CMS supplies
 * (audit C-04). Arabic verbatim; English provisional (C-10). The Service-6 block
 * contains a ⚠ VERIFY string rendered as supplied.
 */
export default async function ServicesPage({ params }: PageParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services');

  const tHome = await getTranslations({ locale, namespace: 'home' });
  const ctaLabel = tHome('hero.ctaPrimary');

  const introParagraphs = t.raw('intro.paragraphs') as string[];
  const offerLabel = t('offerLabel');
  const valueLabel = t('valueLabel');
  const blocks = t.raw('blocks') as ServiceBlockData[];
  const faqItems: AccordionItem[] = (t.raw('faq.items') as FaqEntry[]).map((entry, index) => ({
    id: `services-faq-${index}`,
    question: entry.q,
    answer: entry.a,
  }));

  return (
    <main id="main-content">
      {/* Intro — word-by-word heading reveal + magazine reading-focus paragraphs */}
      <Section tone="page">
        <Container>
          <Stack gap="5" style={{ maxInlineSize: 'var(--container-narrow)' }}>
            <Heading level={1} size="h1">
              <TextReveal text={t('intro.heading')} />
            </Heading>
            <ReadingParagraphs paragraphs={introParagraphs} />
          </Stack>
        </Container>
      </Section>

      {/* Services — 3D stacked-cards story (content verbatim; interaction only) */}
      <Section tone="page" spacing="none">
        <ServicesStack
          cards={blocks}
          offerLabel={offerLabel}
          valueLabel={valueLabel}
          ctaLabel={ctaLabel}
          ctaHref="/contact"
          exitUpLabel={t('exitUpLabel')}
          exitDownLabel={t('exitDownLabel')}
        />
      </Section>

      {/* FAQ — premium art-directed dark scene (replaces plain accordion) */}
      <FaqSection
        heading={t('faq.heading')}
        items={faqItems}
        ctaLabel={t('faq.cta')}
        ctaHref="/contact"
      />
    </main>
  );
}
