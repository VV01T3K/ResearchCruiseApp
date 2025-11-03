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

  // id for accessible description when asterisk is present
  const descId = showAsterisk && name ? `${name}-required-desc` : undefined;

  return (
    <label htmlFor={name} className={cn('block mb-2 text-sm font-medium text-gray-900', className)}>
      {/* Wrap the label text so hovering over the text (before the asterisk) shows the explanation */}
      <span
        className="inline"
        title={showAsterisk ? "Pole jest obowiązkowe do wypełnienia" : undefined}
        {...(descId ? { 'aria-describedby': descId } : {})}
        tabIndex={showAsterisk ? 0 : undefined}
      >
        {labelContent}
      </span>
      {showAsterisk && (
        <span
          className="ml-1 text-red-600 font-bold"
          title="Pole jest obowiązkowe do wypełnienia"
        >
          *
        </span>
      )}
      {showAsterisk && descId && (
        <span id={descId} className="sr-only">
          Pola oznaczone gwiazdką są obowiązkowe do wypełnienia.
        </span>
      )}
    </label>
  );
}
