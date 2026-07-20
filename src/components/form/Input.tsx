import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/Icon/Icon';
import styles from './Field.module.css';

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label: string;
  id: string;
  error?: string;
};

/** Labeled text input (Doc 10 §17). Persistent visible label + accessible error. */
export function Input({ label, id, error, required, className, ...rest }: InputProps) {
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
      <input
        id={id}
        className={cn(styles.control, error && styles.controlError, className)}
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
