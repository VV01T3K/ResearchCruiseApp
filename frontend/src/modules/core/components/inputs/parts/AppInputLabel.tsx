import { cn } from '@/core/lib/utils';

type Props = {
  name: string;

  label: React.ReactNode | undefined;
};
export function AppInputLabel({ name, label }: Props) {
  if (!label) return null;

  return (
    <label htmlFor={name} className={cn('block mb-2 text-sm font-medium text-gray-900')}>
      {label}
    </label>
  );
}
