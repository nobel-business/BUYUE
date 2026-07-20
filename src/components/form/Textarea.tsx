import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/Icon/Icon';
import styles from './Field.module.css';

type TextareaProps = ComponentPropsWithoutRef<'textarea'> & {
  label: string;
  id: string;
  error?: string;
};

/** Labeled multi-line input (Doc 10 §18). */
export function Textarea({ label, id, error, required, className, ...rest }: TextareaProps) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <textarea
        id={id}
        rows={5}
        className={cn(styles.control, styles.textarea, error && styles.controlError, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        aria-required={required || undefined}
        {...rest}
      />
      {error && (
        <span id={errorId} className={styles.error}>
          <Icon name="alert-circle" size={16} />
          {error}
        </span>
      )}
    </div>
  );
}
