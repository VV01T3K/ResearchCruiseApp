import { cn } from '@/core/lib/utils';

type Props = {
  value: React.ReactNode | undefined;

  name?: string;
  className?: string;
  required?: boolean;
};
export function AppInputLabel({ name, value, className, required }: Props) {
  if (!value) return null;

  // Normalize label text: if it already ends with '*' treat it as required and strip the star
  let labelContent: React.ReactNode = value;
  let showAsterisk = false;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.endsWith('*')) {
      labelContent = trimmed.replace(/\*$/, '').trim();
      showAsterisk = true;
    }
  }

  // Also show asterisk when `required` prop is passed
  if (required) {
    showAsterisk = true;
  }

  return (
    <label htmlFor={name} className={cn('block mb-2 text-sm font-medium text-gray-900', className)}>
      {labelContent}
      {showAsterisk && (
        <span
          className="ml-1 text-red-600 font-bold"
          title="pole wymagane do wypełnienia"
          aria-hidden="false"
          aria-label="pole wymagane do wypełnienia"
        >
          *
        </span>
      )}
    </label>
  );
}
