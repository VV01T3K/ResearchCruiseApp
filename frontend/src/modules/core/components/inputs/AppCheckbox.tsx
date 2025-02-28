import CheckIcon from 'bootstrap-icons/icons/check-lg.svg?react';
import React from 'react';

import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';
import { cn } from '@/core/lib/utils';

type Props = {
  name: string;
  checked: boolean;

  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  onBlur?: () => void;
  onChange?: (value: boolean) => void;
  errors?: string[];
  label?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  helper?: React.ReactNode;
};
export function AppCheckbox({
  name,
  checked,
  variant = 'primary',
  size = 'sm',
  onBlur,
  onChange,
  errors,
  label,
  className,
  disabled,
  helper,
}: Props) {
  const elementRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={elementRef}
        type="checkbox"
        name={name}
        id={name}
        className="hidden"
        checked={checked}
        onBlur={onBlur}
        onChange={(evt) => onChange?.(evt.target.checked)}
        disabled={disabled}
      />
      <div className={cn('flex flex-col', className)}>
        <div className="flex items-center gap-2">
          <AppInputLabel name={name} label={label} className="mb-0" />

          <div onClick={() => elementRef.current?.click()}>
            <div
              className={cn(
                'flex items-center justify-center border border-gray-300 rounded-md transition-all duration-300',
                sizes[size],
                checked && variants[variant][disabled ? 'disabled' : 'enabled'],
                !checked && (disabled ? 'bg-gray-100' : 'hover:border-gray-400 bg-white'),
                disabled ? 'cursor-default' : 'cursor-pointer'
              )}
            >
              {checked && <CheckIcon />}
            </div>
          </div>
        </div>

        <div className={cn('flex flex-col justify-between text-sm', errors || helper ? 'mt-2' : '')}>
          <AppInputHelper helper={helper} />
          <AppInputErrorsList errors={errors} />
        </div>
      </div>
    </>
  );
}

const sizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
};

const variants = {
  primary: {
    enabled: 'bg-primary border-primary text-white',
    disabled: 'bg-primary-500 border-primary-500 text-primary-200',
  },
  success: {
    enabled: 'bg-success border-success text-white',
    disabled: 'bg-success-400 border-success-400 text-success-200',
  },
  danger: {
    enabled: 'bg-danger border-danger text-white',
    disabled: 'bg-danger-400 border-danger-400 text-danger-200',
  },
  warning: {
    enabled: 'bg-warning border-warning text-black',
    disabled: 'bg-warning-100 border-warning-100 text-warning-800',
  },
  info: {
    enabled: 'bg-info border-info text-white',
    disabled: 'bg-info-200 border-info-200 text-info-100',
  },
  plain: {
    enabled: 'text-black',
    disabled: 'text-gray-400 bg-gray-100',
  },
};
