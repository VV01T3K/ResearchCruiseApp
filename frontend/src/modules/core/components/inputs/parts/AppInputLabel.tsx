import { cn } from '@/core/lib/utils';

type Props = {
  value: React.ReactNode | undefined;

  name?: string;
  className?: string;
};
export function AppInputLabel({ name, value, className }: Props) {
  if (!value) return null;

  return (
    <label htmlFor={name} className={cn('block mb-2 text-sm font-medium text-gray-900', className)}>
      {value}
    </label>
  );
}
