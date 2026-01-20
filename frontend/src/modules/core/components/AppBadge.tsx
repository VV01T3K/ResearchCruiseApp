type Props = {
  children: React.ReactNode;

  variant?: keyof typeof variants;
  className?: string;
};

export function AppBadge({ children, variant = 'primary', className = '' }: Props) {
  return <span className={`me-2 rounded px-2.5 py-1 text-xs ${variants[variant]} ${className}`}>{children}</span>;
}

const variants = {
  primary: 'bg-primary-100 text-primary-dark',
  success: 'bg-success-200 text-success-dark',
  danger: 'bg-danger-200 text-danger-dark',
  warning: 'bg-warning-100 text-warning-dark',
  info: 'bg-info-100 text-info-dark',
};
