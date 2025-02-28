import { cn } from '@/core/lib/utils';

type Props = {
  name: string;

  label: React.ReactNode | undefined;
  className?: string;
};
export function AppInputLabel({ name, label, className }: Props) {
  if (!label) return null;

  return (
    <label htmlFor={name} className={cn('block mb-2 text-sm font-medium text-gray-900', className)}>
      {label}
    </label>
  );
}
