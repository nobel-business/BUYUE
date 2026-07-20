import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Heading, Text } from '@/components/ui/Typography';
import styles from './StatusState.module.css';

type StatusStateProps = {
  /** Localized title/description are passed in by the consumer — never invented (Doc 07 §1). */
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

type BaseProps = StatusStateProps & {
  icon: IconName;
  variant: 'empty' | 'error' | 'success';
  role?: 'alert' | 'status';
};

function StatusStateBase({
  icon,
  variant,
  role,
  title,
  description,
  action,
  className,
}: BaseProps) {
  return (
    <div className={cn(styles.state, styles[variant], className)} role={role}>
      <Icon name={icon} size={32} className={styles.icon} />
      {title && (
        <Heading level={3} size="h4">
          {title}
        </Heading>
      )}
      {description && (
        <Text tone="secondary" className={styles.description}>
          {description}
        </Text>
      )}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

/** Graceful "no data yet" state for dynamic regions (Doc 09 §23, Doc 10 §41). */
export function EmptyState(props: StatusStateProps) {
  return <StatusStateBase icon="info" variant="empty" {...props} />;
}

/** Error state — announced to AT; conveys meaning via icon + text, not color alone (Doc 10 §42). */
export function ErrorState(props: StatusStateProps) {
  return <StatusStateBase icon="alert-circle" variant="error" role="alert" {...props} />;
}

/** Success confirmation — announced to AT (Doc 10 §43). */
export function SuccessState(props: StatusStateProps) {
  return <StatusStateBase icon="check" variant="success" role="status" {...props} />;
}
