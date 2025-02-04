import DashLgIcon from 'bootstrap-icons/icons/dash-lg.svg?react';
import PlusLgIcon from 'bootstrap-icons/icons/plus-lg.svg?react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputErrorTriangle } from '@/core/components/inputs/parts/AppInputErrorTriangle';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';
import { cn } from '@/core/lib/utils';

type Props = {
  name: string;
  value: number;

  onBlur?: (evt: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  errors?: string[];
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
  errors,
  label,
  required,
  className,
  disabled,
  helper,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col">
      <AppInputLabel name={name} label={label} />
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
            'bg-gray-50 border border-gray-300 h-11 text-center text-gray-900 text-sm block w-full py-2.5',
            'transition duration-300 ease-in-out',
            'focus:ring-primary focus:border-primary focus:shadow focus:outline-none transform:scale-105',
            disabled ? 'bg-gray-200' : '',
            errors?.length ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
          )}
          ref={inputRef}
        />
        <AppNumberInputButton onClick={onIncrement} side="right" disabled={disabled} inputToFocus={inputRef} />
        <AppInputErrorTriangle errors={errors} />
      </div>
      <div className="flex flex-row justify-between mt-2 text-sm">
        <AppInputHelper helper={helper} />
        <AppInputErrorsList errors={errors} />
      </div>
    </div>
  );
}

type ButtonProps = {
  side: 'left' | 'right';
  inputToFocus: React.RefObject<HTMLInputElement | null>;
  onClick: (() => void) | undefined;
  disabled: boolean | undefined;
};
function AppNumberInputButton({ side, inputToFocus, onClick, disabled }: ButtonProps) {
  function handleClick() {
    onClick?.();
    inputToFocus.current?.focus();
    inputToFocus.current?.blur();
  }

  return (
    <AppButton
      onClick={() => handleClick()}
      disabled={disabled}
      className={cn(
        'h-11 w-11 flex items-center justify-center',
        'text-gray-500',
        'transition duration-300 ease-in-out',
        'focus:ring-primary focus:border-primary focus:shadow focus:outline-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'px-2 border border-collapse border-gray-300',
        side === 'left' ? 'rounded-l' : 'rounded-r',
        disabled ? 'bg-gray-300' : 'bg-gray-100 hover:text-gray-900'
      )}
      variant="plain"
      size="plain"
    >
      {side === 'left' ? <DashLgIcon /> : <PlusLgIcon />}
    </AppButton>
  );
}
