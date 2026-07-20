import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { localeAlternates } from '@/lib/seo';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Heading, Text } from '@/components/typography/Typography';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import type { AccordionItem } from '@/components/Accordion/Accordion';
import { FaqSection } from '@/components/faq/FaqSection';
import { Statistic } from '@/components/clients/Statistic';
import { ClientLogoMosaic } from '@/components/clients/ClientLogoMosaic';
import { ProjectGallery } from '@/components/clients/ProjectGallery';
import { Testimonials } from '@/components/clients/Testimonials';
import { getStore } from '@/lib/adminStore';
import { buttonClasses } from '@/components/Button/Button';
import { SceneReveal } from '@/lib/motion/SceneReveal';
import { Magnetic } from '@/lib/motion/Magnetic';

type PageParams = { params: Promise<{ locale: string }> };
type FaqEntry = { q: string; a: string };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'clients.meta' });
  // No approved description in Doc 02 for Clients — title only (nothing invented).
  return { title: { absolute: t('title') }, alternates: localeAlternates(locale, '/clients') };
}

/**
 * Clients page (Doc 09 Page 4, Doc 02 §4). Data-driven; admin-managed later (C-04).
 * Logos are text placeholders (C-11/H-15); gallery shows approved category tiles
 * (images pending, C-11); testimonials render nothing until content exists (H-06).
 */
export default async function ClientsPage({ params }: PageParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('clients');

  const statValue = t.raw('intro.statValue') as number;
  const categories = t.raw('gallery.categories') as string[];
  const faqItems: AccordionItem[] = (t.raw('faq.items') as FaqEntry[]).map((entry, index) => ({
    id: `clients-faq-${index}`,
    question: entry.q,
    answer: entry.a,
  }));
  // Logos + testimonials come from the admin store (dev scaffold, C-02); seeded
  // from Doc 02 §4.2 logos, testimonials empty until added (H-06).
  const store = await getStore();

  return (
    <main id="main-content">
      {/* Intro + stat — heading assembles (mask), stat counts up, body resolves from blur */}
      <Section tone="page">
        <Container>
          <Stack gap="5">
            <SceneReveal variant="mask">
              <Heading level={1} size="h1">
                {t('intro.heading')}
              </Heading>
            </SceneReveal>
            <Statistic value={statValue} prefix={t('intro.statPrefix')} />
            <SceneReveal variant="blur">
              <Text size="body-l" tone="secondary" style={{ maxInlineSize: '60ch' }}>
                {t('intro.body')}
              </Text>
            </SceneReveal>
          </Stack>
        </Container>
      </Section>

      {/* Logo wall — static dark band (no scroll track); spotlight walks all 30 */}
      <ClientLogoMosaic interactive={false} />

      {/* Project gallery */}
      <Section tone="sunken">
        <Container>
          <Stack gap="6">
            <SectionHeader heading={t('gallery.heading')} level={2} />
            <SceneReveal variant="scale">
              <ProjectGallery categories={categories} />
            </SceneReveal>
          </Stack>
        </Container>
      </Section>

      {/* Testimonials — from the admin store; renders nothing while empty (H-06) */}
      <Testimonials items={store.testimonials} />

      {/* Final CTA — headline settles in from scale; the button is magnetic + glows */}
      <Section tone="inverse">
        <Container>
          <Stack gap="6" align="center">
            <SceneReveal variant="scale">
              <SectionHeader
                heading={t('finalCta.heading')}
                subheading={t('finalCta.body')}
                align="center"
                level={2}
              />
            </SceneReveal>
            <Magnetic>
              <Link href="/contact" className={buttonClasses('primary', 'lg')}>
                {t('finalCta.cta')}
              </Link>
            </Magnetic>
          </Stack>
        </Container>
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
