import { cn } from '@/lib/utils';

type Props = {
  value: React.ReactNode | undefined;

  name?: string;
  className?: string;
  showRequiredAsterisk?: boolean;
};
export function InputLabel({ name, value, className, showRequiredAsterisk }: Props) {
  if (!value) return null;

  const labelContent: React.ReactNode = value;
  let showAsterisk = false;

  if (showRequiredAsterisk) {
    showAsterisk = true;
  }

  return (
    <label htmlFor={name} className={cn('mb-2 block text-sm font-medium text-foreground', className)}>
      <span title={showAsterisk ? 'Pole jest obowiązkowe do wypełnienia' : undefined}>{labelContent}</span>
      {showAsterisk && (
        <span className="ml-1 font-bold text-danger" title="Pole jest obowiązkowe do wypełnienia">
          *
        </span>
      )}
    </label>
  );
}
