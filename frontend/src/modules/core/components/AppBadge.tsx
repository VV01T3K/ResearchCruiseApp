type Props = {
  children: React.ReactNode;

  variant?: keyof typeof variants;
};

export function AppBadge({ children, variant = 'primary' }: Props) {
  return <span className={`text-xs me-2 px-2.5 py-1 rounded ${variants[variant]}`}>{children}</span>;
}

const variants = {
  primary: 'bg-primary-100 text-primary-dark',
  success: 'bg-success-200 text-success-dark',
  danger: 'bg-danger-200 text-danger-dark',
  warning: 'bg-warning-100 text-warning-dark',
  info: 'bg-info-100 text-info-dark',
};
