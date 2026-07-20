'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Heading, Text } from '@/components/typography/Typography';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/form/Input';
import { Textarea } from '@/components/form/Textarea';
import { Icon } from '@/components/Icon/Icon';
import styles from './admin.module.css';

type Testimonial = { id: string; quote: string; author: string; role?: string };
type Store = { logos: string[]; testimonials: Testimonial[] };

/**
 * INTERIM ADMIN PANEL (dev scaffold — audit C-02). Dev-only; 404s in production.
 * No auth, local file store. Manages client logos + testimonials, which reflect
 * live on the public Clients page. Full/production admin + auth is pending the
 * backend decision.
 */
export default function AdminPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }
  return <AdminDashboard />;
}

function AdminDashboard() {
  const [store, setStore] = useState<Store | null>(null);
  const [logoName, setLogoName] = useState('');
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/admin')
      .then((response) => response.json())
      .then(setStore)
      .catch(() => setStore({ logos: [], testimonials: [] }));
  }, []);

  const mutate = async (url: string, method: 'POST' | 'DELETE', body: unknown) => {
    setBusy(true);
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (response.ok) setStore(await response.json());
    } finally {
      setBusy(false);
    }
  };

  const addLogo = async () => {
    if (!logoName.trim()) return;
    await mutate('/api/admin/logos', 'POST', { name: logoName });
    setLogoName('');
  };

  const addTestimonial = async () => {
    if (!quote.trim() || !author.trim()) return;
    await mutate('/api/admin/testimonials', 'POST', { quote, author, role });
    setQuote('');
    setAuthor('');
    setRole('');
  };

  return (
    <main id="main-content">
      <Section tone="page">
        <Container>
          <Stack gap="8">
            <Stack gap="3">
              <Heading level={1} size="h2">
                Buyue Admin
              </Heading>
              <Card tone="accent" padding="md">
                <Text size="small">
                  ⚠ Interim dev scaffold (audit C-02): no authentication, local file store,
                  dev-only. Replace with the production backend + auth before launch. Edits here
                  reflect live on the Clients page.
                </Text>
              </Card>
            </Stack>

            {/* Client Logos */}
            <Stack gap="4" as="section">
              <Heading level={2} size="h3">
                Client Logos ({store?.logos.length ?? 0})
              </Heading>
              <div className={styles.addRow}>
                <div className={styles.grow}>
                  <Input
                    id="admin-logo"
                    label="Brand name"
                    value={logoName}
                    onChange={(event) => setLogoName(event.target.value)}
                    placeholder="e.g. Aramco"
                  />
                </div>
                <Button onClick={addLogo} isLoading={busy} iconStart="plus">
                  Add logo
                </Button>
              </div>
              <ul className={styles.logoList}>
                {store?.logos.map((logo) => (
                  <li key={logo}>
                    <Card padding="md">
                      <div className={styles.itemRow}>
                        <Text>{logo}</Text>
                        <button
                          type="button"
                          className={styles.delete}
                          aria-label={`Delete ${logo}`}
                          onClick={() => mutate('/api/admin/logos', 'DELETE', { name: logo })}
                        >
                          <Icon name="close" size={18} />
                        </button>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            </Stack>

            {/* Testimonials */}
            <Stack gap="4" as="section">
              <Heading level={2} size="h3">
                Testimonials ({store?.testimonials.length ?? 0})
              </Heading>
              <Card padding="lg">
                <Stack gap="3">
                  <Textarea
                    id="admin-quote"
                    label="Quote"
                    value={quote}
                    onChange={(event) => setQuote(event.target.value)}
                  />
                  <Input
                    id="admin-author"
                    label="Author"
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                  />
                  <Input
                    id="admin-role"
                    label="Role / company (optional)"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                  />
                  <div>
                    <Button onClick={addTestimonial} isLoading={busy} iconStart="plus">
                      Add testimonial
                    </Button>
                  </div>
                </Stack>
              </Card>
              <Stack gap="3">
                {store?.testimonials.length === 0 && (
                  <Text tone="muted">
                    No testimonials yet. Add one above — it will appear on the Clients page.
                  </Text>
                )}
                {store?.testimonials.map((testimonial) => (
                  <Card key={testimonial.id} padding="md">
                    <div className={styles.itemRow}>
                      <div>
                        <Text>{testimonial.quote}</Text>
                        <Text size="small" tone="muted">
                          — {testimonial.author}
                          {testimonial.role ? `, ${testimonial.role}` : ''}
                        </Text>
                      </div>
                      <button
                        type="button"
                        className={styles.delete}
                        aria-label="Delete testimonial"
                        onClick={() =>
                          mutate('/api/admin/testimonials', 'DELETE', { id: testimonial.id })
                        }
                      >
                        <Icon name="close" size={18} />
                      </button>
                    </div>
                  </Card>
                ))}
              </Stack>
            </Stack>

            {/* Services (not editable in scaffold) */}
            <Stack gap="3" as="section">
              <Heading level={2} size="h3">
                Services
              </Heading>
              <Card tone="sunken" padding="md">
                <Text tone="secondary">
                  Service content is bilingual, legally-approved copy. Editing services requires the
                  production CMS/backend (audit C-02) so Arabic and English stay in sync — so it is
                  intentionally not editable in this dev scaffold.
                </Text>
              </Card>
            </Stack>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
