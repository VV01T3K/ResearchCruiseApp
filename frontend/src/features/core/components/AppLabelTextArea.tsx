import { cn } from '@lib/utils';

export function AppLabelTextArea({
  name,
  value,
  onBlur,
  onChange,
  error,
  label,
  required = undefined,
  className = undefined,
}: {
  name: string;
  value: string;
  error?: string;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  label: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block mb-2 text-gray-900">
        {label}
      </label>
      <textarea
        name={name}
        id={name}
        className={cn(
          'block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary resize-none',
          className
        )}
        placeholder=" "
        required={required}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
      />
      {error ? <p className="mt-2 text-danger text-sm">{error}</p> : null}
    </div>
  );
}
