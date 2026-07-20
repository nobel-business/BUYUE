'use client';

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { Button } from '@/components/Button/Button';
import { SuccessState, ErrorState } from '@/components/feedback/StatusState';
import { Stack } from '@/components/primitives/Stack';
import styles from './ContactForm.module.css';

type FieldName = 'name' | 'company' | 'email' | 'phone' | 'service' | 'message';
type Values = Record<FieldName, string>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact form (Doc 10 §16, Doc 09 Page 5). Client validation + success/error
 * states + honeypot spam trap. Posts to /api/contact — a STUB (audit C-09):
 * the real lead destination, server-side spam protection, and PDPL consent +
 * Privacy Policy are pending. Field labels are approved (Doc 02 §5.4);
 * validation/status messages are provisional microcopy (H-07).
 */
export function ContactForm({ serviceOptions }: { serviceOptions: string[] }) {
  const t = useTranslations('contact.form');
  const [values, setValues] = useState<Values>({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const setField =
    (name: FieldName) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((current) => ({ ...current, [name]: event.target.value }));

  const validate = (): Partial<Record<FieldName, string>> => {
    const next: Partial<Record<FieldName, string>> = {};
    if (!values.name.trim()) next.name = t('required');
    if (!values.email.trim()) next.email = t('required');
    else if (!EMAIL_RE.test(values.email)) next.email = t('invalidEmail');
    if (!values.message.trim()) next.message = t('required');
    return next;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (honeypot) {
      setStatus('success'); // silently drop bots
      return;
    }
    const nextErrors = validate();
    setErrors(nextErrors);
    const firstKey = Object.keys(nextErrors)[0];
    if (firstKey) {
      formRef.current?.querySelector<HTMLElement>(`#contact-${firstKey}`)?.focus();
      return;
    }
    setStatus('submitting');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      setStatus(response.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return <SuccessState title={t('success')} />;
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className={styles.form}>
      <Stack gap="4">
        <Input
          id="contact-name"
          name="name"
          label={t('fields.name')}
          value={values.name}
          onChange={setField('name')}
          error={errors.name}
          required
          autoComplete="name"
        />
        <Input
          id="contact-company"
          name="company"
          label={t('fields.company')}
          value={values.company}
          onChange={setField('company')}
          autoComplete="organization"
        />
        <Input
          id="contact-email"
          name="email"
          type="email"
          dir="ltr"
          inputMode="email"
          label={t('fields.email')}
          value={values.email}
          onChange={setField('email')}
          error={errors.email}
          required
          autoComplete="email"
        />
        <Input
          id="contact-phone"
          name="phone"
          type="tel"
          dir="ltr"
          inputMode="tel"
          label={t('fields.phone')}
          value={values.phone}
          onChange={setField('phone')}
          autoComplete="tel"
        />
        <Select
          id="contact-service"
          name="service"
          label={t('fields.service')}
          placeholder={t('fields.service')}
          options={serviceOptions}
          value={values.service}
          onChange={setField('service')}
        />
        <Textarea
          id="contact-message"
          name="message"
          label={t('fields.message')}
          value={values.message}
          onChange={setField('message')}
          error={errors.message}
          required
        />

        {/* Honeypot spam trap — hidden from users and assistive tech. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className={styles.honeypot}
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />

        <Button type="submit" size="lg" isLoading={status === 'submitting'}>
          {t('submit')}
        </Button>

        {status === 'error' && <ErrorState description={t('error')} />}
      </Stack>
    </form>
  );
}
