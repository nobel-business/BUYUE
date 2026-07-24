import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { localeAlternates } from '@/lib/config/seo';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import type { AccordionItem } from '@/components/ui/Accordion';
import { FaqSection } from '@/components/sections/faq/FaqSection';
import {
  ServiceShowcase,
  type ShowcaseService,
} from '@/components/sections/services/ServiceShowcase';
import { ServicesHero } from '@/components/sections/services/ServicesHero';

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
  const blocks = t.raw('blocks') as ServiceBlockData[];

  // ── Service images ─────────────────────────────────────────────────────────
  // IMAGE PLACEMENT LOGIC (audit C-11): drop one path per service here, indexed to
  // match `blocks` (0 = first service … 9 = last). Public path or remote URL both
  // work — `next/image` handles either. Leave an entry '' (or the whole array
  // short) and that service shows the branded placeholder instead. This is the ONLY
  // place to wire imagery; the component needs no change.
  const SERVICE_IMAGES: string[] = [
    '/assets/services/branding.png', // 0  إنشاء الهوية البصرية والدعائية
    '/assets/services/social-media.png', // 1  إدارة حسابات السوشيال ميديا
    '/assets/services/campaign-production.png', // 2  تصوير وإنتاج الحملات الإعلانية
    '/assets/services/ugc-content.png', // 3  إنتاج محتوى UGC / EGC / FGC
    '/assets/services/seo.png', // 4  تحسين محركات البحث SEO
    '/assets/services/web-development.png', // 5  تصميم وتطوير المواقع والتطبيقات
    '/assets/services/photography-video.png', // 6  التصوير الفوتوغرافي والفيديو
    '/assets/services/exhibition-stands.png', // 7  تصميم وتنفيذ أجنحة المعارض
    '/assets/services/outdoor-advertising.png', // 8  الشاشات الإعلانية والدعاية الخارجية
    '/assets/services/print-gifts.png', // 9  الهدايا الدعائية والمطبوعات
  ];

  // Showcase model, verbatim from the approved blocks: name (title), lead (intro),
  // the offerings list (features), the value line, and the image slot above.
  const showcaseServices: ShowcaseService[] = blocks.map((block, index) => ({
    id: `service-${index}`,
    title: block.title,
    intro: block.intro,
    offerings: block.features,
    value: block.value,
    image: SERVICE_IMAGES[index] || undefined,
  }));

  const faqItems: AccordionItem[] = (t.raw('faq.items') as FaqEntry[]).map((entry, index) => ({
    id: `services-faq-${index}`,
    question: entry.q,
    answer: entry.a,
  }));

  return (
    <main id="main-content">
      {/* Hero — "The Refractor": full-first-screen scene with the prism light metaphor.
          One beam refracts into a warm brand spectrum = integrated creative services. */}
      <ServicesHero
        heading={t('intro.heading')}
        eyebrow={t('intro.eyebrow')}
        standfirst={t('intro.standfirst')}
        paragraphs={introParagraphs}
        ctaLabel={ctaLabel}
        ctaHref="/contact"
      />

      {/* Services — three-column selector: pick a service (left) to cross-dissolve
          its large chamfered image (centre) + detail content (right). Replaces the
          former 3D card deck; content verbatim, interaction only. */}
      <Section tone="page" spacing="default">
        <Container size="wide">
          <ServiceShowcase
            heading={t('offerLabel')}
            valueLabel={t('valueLabel')}
            services={showcaseServices}
            ctaLabel={ctaLabel}
            ctaHref="/contact"
          />
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
