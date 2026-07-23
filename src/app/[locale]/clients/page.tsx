import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { localeAlternates } from '@/lib/config/seo';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Stack } from '@/components/layout/Stack';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { AccordionItem } from '@/components/ui/Accordion';
import { FaqSection } from '@/components/sections/faq/FaqSection';
import { SpinningQuestionMark } from '@/components/sections/faq/SpinningQuestionMark';
import { ClientsHero } from '@/components/sections/clients/ClientsHero';
import { ClientLogoMosaic } from '@/components/sections/clients/ClientLogoMosaic';
import { ProjectGallery } from '@/components/sections/clients/ProjectGallery';
import { Testimonials } from '@/components/sections/clients/Testimonials';
import { getStore } from '@/lib/data/adminStore';
import { buttonClasses } from '@/components/ui/Button';
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
      {/* Hero — "Constellation of Trust": the roster as a sky of client logos linked to
          the Buyue mark. Full-first-screen, so the logo wall no longer peeks on load. */}
      <ClientsHero
        heading={t('intro.heading')}
        statValue={statValue}
        statPrefix={t('intro.statPrefix')}
        body={t('intro.body')}
        ctaLabel={t('finalCta.cta')}
        ctaHref="/contact"
      />

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

      {/* Bridge — a serif "?" revolving around its own axis fills the empty band
          between the CTA and the FAQ. Decorative, motion-safe (SpinningQuestionMark). */}
      <SpinningQuestionMark />

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
