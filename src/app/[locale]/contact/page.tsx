import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { localeAlternates } from '@/lib/config/seo';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Stack } from '@/components/layout/Stack';
import { Grid } from '@/components/layout/Grid';
import { Heading, Text } from '@/components/ui/Typography';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ContactForm } from '@/components/forms/ContactForm';
import { SceneReveal } from '@/lib/motion/SceneReveal';
import styles from './contact.module.css';

type PageParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact.meta' });
  return {
    title: { absolute: t('title') },
    description: t('description'),
    keywords: t('keywords'),
    alternates: localeAlternates(locale, '/contact'),
  };
}

/**
 * Contact page (Doc 09 Page 5, Doc 02 §5). Contact values are rendered verbatim
 * as supplied but are ⚠ UNCONFIRMED (audit C-08 — email/domain/phone). Social
 * links omitted (no URLs). Form posts to a stub (audit C-09).
 */
export default async function ContactPage({ params }: PageParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const servicesT = await getTranslations('services');

  const whyItems = t.raw('why.items') as string[];
  const phones = t.raw('details.phones') as string[];
  const address = t('details.address');
  const email = t('details.email');
  const serviceOptions = (servicesT.raw('blocks') as { title: string }[]).map((b) => b.title);

  const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

  return (
    <main id="main-content">
      {/* Intro — heading assembles upward (mask), body resolves out of a soft blur */}
      <Section tone="page">
        <Container>
          <SceneReveal variant="mask">
            <SectionHeader
              heading={t('intro.heading')}
              subheading={t('intro.subheading')}
              level={1}
              headingSize="h1"
            />
          </SceneReveal>
          <SceneReveal variant="blur">
            <Text
              tone="secondary"
              style={{ maxInlineSize: '60ch', marginBlockStart: 'var(--space-4)' }}
            >
              {t('intro.body')}
            </Text>
          </SceneReveal>
        </Container>
      </Section>

      {/* Details + Why / Form — the two columns glide in from opposite edges */}
      <Section tone="page" spacing="compact">
        <Container>
          <Grid columns={2} gap="lg">
            <SceneReveal variant="left">
              <Stack gap="8">
                <Stack gap="4" as="section">
                  <Heading level={2} size="h3">
                    {t('details.heading')}
                  </Heading>
                  <div className={styles.detail}>
                    <Text size="small" tone="muted">
                      {t('details.addressLabel')}
                    </Text>
                    <Text>{address}</Text>
                  </div>
                  <div className={styles.detail}>
                    <Text size="small" tone="muted">
                      {t('details.phoneLabel')}
                    </Text>
                    {phones.map((phone) => (
                      <a key={phone} href={telHref(phone)} className={styles.link} dir="ltr">
                        {phone}
                      </a>
                    ))}
                  </div>
                  <div className={styles.detail}>
                    <Text size="small" tone="muted">
                      {t('details.emailLabel')}
                    </Text>
                    <a href={`mailto:${email}`} className={styles.link} dir="ltr">
                      {email}
                    </a>
                  </div>
                </Stack>

                <Stack gap="4" as="section">
                  <Heading level={2} size="h3">
                    {t('why.heading')}
                  </Heading>
                  <ul className={styles.whyList}>
                    {whyItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </Stack>
              </Stack>
            </SceneReveal>

            <SceneReveal variant="right">
              <Stack gap="5" as="section">
                <Heading level={2} size="h3">
                  {t('form.heading')}
                </Heading>
                <ContactForm serviceOptions={serviceOptions} />
              </Stack>
            </SceneReveal>
          </Grid>
        </Container>
      </Section>
    </main>
  );
}
