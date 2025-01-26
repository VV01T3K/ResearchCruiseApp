import { cn } from '@lib/utils';
import ExclamationTraingleIcon from 'bootstrap-icons/icons/exclamation-triangle.svg?react';

type AppInputProps = {
  name: string;
  value: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  label?: React.ReactNode;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  helper?: React.ReactNode;
};

export function AppInput({
  name,
  value,
  placeholder,
  type = 'text',
  onBlur,
  onChange,
  error,
  label,
  required = undefined,
  className = undefined,
  disabled = undefined,
  helper,
}: AppInputProps) {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className={cn('block mb-2 text-sm font-medium text-gray-900')}>
          {label}
        </label>
      )}
      <div className="flex flex-center relative">
        <input
          name={name}
          value={value}
          placeholder={placeholder || ''}
          type={type}
          onBlur={onBlur}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={cn(
            className,
            'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5',
            'transition duration-300 ease-in-out',
            'focus:ring-blue-500 focus:border-blue-500 focus:shadow focus:outline-none',
            disabled ? 'bg-gray-200' : '',
            error ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
          )}
        />
        {error && <ExclamationTraingleIcon className="w-5 h-5 text-danger absolute right-2.5 top-2.5" />}
      </div>
      <div className="flex flex-row justify-between mt-2 text-sm">
        {helper && <div className="text-gray-500">{helper}</div>}
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
}
