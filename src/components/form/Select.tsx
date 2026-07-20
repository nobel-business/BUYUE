import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/Icon/Icon';
import styles from './Field.module.css';

type SelectProps = ComponentPropsWithoutRef<'select'> & {
  label: string;
  id: string;
  error?: string;
  /** Disabled placeholder shown first. */
  placeholder?: string;
  options: string[];
};

/** Labeled native select (Doc 10 §19). Native for reliability + accessibility. */
export function Select({
  label,
  id,
  error,
  required,
  placeholder,
  options,
  className,
  ...rest
}: SelectProps) {
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
      <select
        id={id}
        className={cn(styles.control, error && styles.controlError, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        aria-required={required || undefined}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <span id={errorId} className={styles.error}>
          <Icon name="alert-circle" size={16} />
          {error}
        </span>
      )}
    </div>
  );
}
