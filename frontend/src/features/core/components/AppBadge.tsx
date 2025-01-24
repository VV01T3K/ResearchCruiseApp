import { cn } from '@lib/utils';

const variants = {
  primary: 'bg-primary-light text-primary-dark',
  success: 'bg-success-light text-success-dark',
  danger: 'bg-danger-light text-danger-dark',
  warning: 'bg-warning-light text-warning-dark',
  info: 'bg-info-light text-info-dark',
};

export function AppBadge({
  children,
  variant = 'primary',
}: {
  children: React.ReactNode;
  variant: keyof typeof variants;
}) {
  return <span className={cn('text-xs me-2 px-2.5 py-1 rounded', variants[variant])}>{children}</span>;
}
