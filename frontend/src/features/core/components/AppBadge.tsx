import { cn } from '@lib/utils';

const variants = {
  default: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
};

export function AppBadge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant: keyof typeof variants;
}) {
  return (
    <span className={cn('text-xs me-2 px-2.5 py-1 rounded', variants[variant])}>
      {children}
    </span>
  );
}
