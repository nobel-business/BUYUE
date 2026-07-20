'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Grid } from '@/components/layout/Grid';
import { Section } from '@/components/layout/Section';
import { Stack } from '@/components/layout/Stack';
import { Drawer } from '@/components/overlay/Drawer';
import { Modal } from '@/components/overlay/Modal';
import { Button } from '@/components/ui/Button';
import { ButtonGroup } from '@/components/ui/ButtonGroup';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState, SuccessState } from '@/components/ui/StatusState';
import { TextLink } from '@/components/ui/TextLink';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { Eyebrow, Heading, Text } from '@/components/ui/Typography';
import { Reveal, Stagger, StaggerItem } from '@/lib/motion';

/**
 * DEV-ONLY design-system sandbox (Doc 11 Phase 2 exit criterion — demonstrates
 * the primitives). Gated to development; returns 404 in production so it never
 * ships. Uses neutral English labels only — it is a tool, not site content.
 * Scheduled for removal/relocation in the Final Polish phase (Doc 11 §22).
 */
export default function DesignSystemPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }
  return (
    <ToastProvider>
      <Sandbox />
    </ToastProvider>
  );
}

const swatches = [
  ['Bonfire Flame', 'var(--color-bonfire-flame)'],
  ['Black Powder', 'var(--color-black-powder)'],
  ['Quilt Gold', 'var(--color-quilt-gold)'],
  ['Springtime Rain', 'var(--color-springtime-rain)'],
  ['Lime Taffy', 'var(--color-lime-taffy)'],
  ['Action Primary', 'var(--color-action-primary)'],
] as const;

function Sandbox() {
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <main id="main-content">
      {/* Local dev-only spacing helper for this sandbox (not a system token). */}
      <style>{`.ds-mt{margin-block-start:var(--space-5)}`}</style>
      <Section tone="page">
        <Container>
          <Stack gap="8">
            <SectionHeader
              eyebrow="Design System"
              heading="Buyue — Component Sandbox"
              subheading="Phase 2 primitives, tokens, and motion. Development preview only."
            />

            {/* Colors */}
            <section>
              <Heading level={2} size="h3">
                Color tokens
              </Heading>
              <Grid columns={3} gap="md" style={{ marginBlockStart: 'var(--space-4)' }}>
                {swatches.map(([name, value]) => (
                  <Card key={name} padding="none">
                    <div style={{ height: 88, background: value, borderRadius: '16px 16px 0 0' }} />
                    <div style={{ padding: 'var(--space-4)' }}>
                      <Text size="small">{name}</Text>
                    </div>
                  </Card>
                ))}
              </Grid>
            </section>

            {/* Typography */}
            <section>
              <Heading level={2} size="h3">
                Typography
              </Heading>
              <Stack gap="3" style={{ marginBlockStart: 'var(--space-4)' }}>
                <Eyebrow>Eyebrow / overline</Eyebrow>
                <Heading level={2} size="display">
                  Display heading
                </Heading>
                <Heading level={3} size="h2">
                  Section heading
                </Heading>
                <Text size="body-l" tone="secondary">
                  Lead paragraph — comfortable measure and leading for editorial reading.
                </Text>
                <Text>
                  Body text with a <TextLink href="/design-system">text link</TextLink> inside.
                </Text>
              </Stack>
            </section>

            {/* Buttons */}
            <section>
              <Heading level={2} size="h3">
                Buttons
              </Heading>
              <ButtonGroup className="ds-mt">
                <Button variant="primary" iconEnd="arrow-right">
                  Primary
                </Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="primary" isLoading>
                  Loading
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </ButtonGroup>
            </section>

            {/* Motion */}
            <section>
              <Heading level={2} size="h3">
                Motion (reveal + stagger)
              </Heading>
              <Stagger className="ds-mt">
                <Grid columns={3} gap="md">
                  {[1, 2, 3].map((n) => (
                    <StaggerItem key={n}>
                      <Card>
                        <Text>Staggered card {n}</Text>
                      </Card>
                    </StaggerItem>
                  ))}
                </Grid>
              </Stagger>
              <Reveal className="ds-mt">
                <Card tone="accent">
                  <Text>Revealed on scroll (fade + rise).</Text>
                </Card>
              </Reveal>
            </section>

            {/* Feedback + overlays */}
            <section>
              <Heading level={2} size="h3">
                Feedback & overlays
              </Heading>
              <Grid columns={3} gap="md" className="ds-mt">
                <Card>
                  <EmptyState title="Nothing here yet" description="Empty state placeholder." />
                </Card>
                <Card>
                  <ErrorState title="Something went wrong" description="Error state placeholder." />
                </Card>
                <Card>
                  <SuccessState title="All done" description="Success state placeholder." />
                </Card>
              </Grid>
              <Stack gap="3" className="ds-mt">
                <Skeleton height="1.5rem" width="60%" />
                <Skeleton height="1rem" />
                <Skeleton height="1rem" width="80%" />
              </Stack>
              <ButtonGroup className="ds-mt">
                <Button onClick={() => setModalOpen(true)}>Open modal</Button>
                <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
                  Open drawer
                </Button>
                <Button variant="ghost" onClick={() => addToast('Saved successfully', 'success')}>
                  Show toast
                </Button>
              </ButtonGroup>
            </section>
          </Stack>
        </Container>
      </Section>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Example modal"
        closeLabel="Close"
      >
        <Text tone="secondary">Focus-trapped, scroll-locked, ESC to close.</Text>
      </Modal>

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        closeLabel="Close"
        title="Example drawer"
      >
        <Text tone="secondary">Slides from the reading-start edge (mirrors in RTL).</Text>
      </Drawer>
    </main>
  );
}
