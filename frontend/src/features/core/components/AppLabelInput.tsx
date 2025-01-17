import { cn } from '@lib/utils';

export function AppLabelInput({
  name,
  value,
  type,
  onBlur,
  onChange,
  error,
  label,
  required = undefined,
}: {
  name: string;
  value: string;
  type: React.HTMLInputTypeAttribute;
  error?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  label: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block mb-2 text-gray-900">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        className={cn(
          'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
        )}
        placeholder=" "
        required={required}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
      />
      {error ? <p className="mt-2 text-red-500 text-sm">{error}</p> : null}
    </div>
  );
}
