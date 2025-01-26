import { cn } from '@lib/utils';
import DashLgIcon from 'bootstrap-icons/icons/dash-lg.svg?react';
import PlusLgIcon from 'bootstrap-icons/icons/plus-lg.svg?react';
import ExclamationTraingleIcon from 'bootstrap-icons/icons/exclamation-triangle.svg?react';
import React from 'react';

type AppNumberInputProps = {
  name: string;
  value: number;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onIncrement?: () => void;
  onDecrement?: () => void;
  error?: string;
  label?: React.ReactNode;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  helper?: React.ReactNode;
};

export function AppNumberInput({
  name,
  value,
  onBlur,
  onChange,
  onIncrement,
  onDecrement,
  error,
  label,
  required = undefined,
  className = undefined,
  disabled = undefined,
  helper,
}: AppNumberInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className={cn('block mb-2 text-sm font-medium text-gray-900')}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <AppNumberInputButton onClick={onDecrement} side="left" disabled={disabled} inputToFocus={inputRef} />
        <input
          name={name}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={cn(
            className,
            'bg-gray-50 border border-gray-300 h-11 text-center text-gray-900 text-smblock w-full py-2.5',
            'transition duration-300 ease-in-out',
            'focus:ring-primary focus:border-primary focus:shadow focus:outline-none transform:scale-105',
            disabled ? 'bg-gray-200' : '',
            error ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
          )}
          ref={inputRef}
        />
        <AppNumberInputButton onClick={onIncrement} side="right" disabled={disabled} inputToFocus={inputRef} />
        {error && <ExclamationTraingleIcon className="w-5 h-5 text-danger absolute right-12.5 top-2.5" />}
      </div>
      <div className="flex flex-row justify-between mt-2 text-sm">
        {helper && <div className="text-gray-500">{helper}</div>}
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
}

function AppNumberInputButton({
  onClick,
  side,
  disabled,
  inputToFocus,
}: {
  onClick?: () => void;
  side: 'left' | 'right';
  disabled?: boolean;
  inputToFocus: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <button
      type="button"
      className={cn(
        side === 'left' ? 'rounded-l-lg' : 'rounded-r-lg',
        'bg-gray-100  border border-gray-300 p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none cursor-pointer',
        'transition duration-300 ease-in-out',
        disabled ? 'disabled:cursor-not-allowed' : 'hover:bg-gray-200'
      )}
      onClick={() => {
        if (onClick) onClick();
        inputToFocus.current?.focus();
        inputToFocus.current?.blur();
      }}
      disabled={disabled}
    >
      <div className="w-3 h-3 text-gray-900">{side === 'left' ? <DashLgIcon /> : <PlusLgIcon />}</div>
    </button>
  );
}
