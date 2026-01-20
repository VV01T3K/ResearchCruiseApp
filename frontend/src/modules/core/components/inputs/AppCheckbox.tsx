import { Checkbox } from '@base-ui/react/checkbox';
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
  labelPosition?: 'top' | 'left';
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
  labelPosition = 'left',
  className,
  disabled,
  helper,
}: Props) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div className={cn('flex items-center gap-2', labelPosition === 'left' ? 'flex-row' : 'flex-col')}>
        <AppInputLabel name={name} value={label} className="mb-0" />

        <Checkbox.Root
          name={name}
          checked={checked}
          onCheckedChange={(checked) => onChange?.(checked === true)}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(
            'flex items-center justify-center rounded-md border border-gray-300 transition-all duration-300',
            sizes[size],
            checked && variants[variant][disabled ? 'disabled' : 'enabled'],
            !checked && (disabled ? 'bg-gray-100' : 'bg-white hover:border-gray-400'),
            disabled ? 'cursor-default' : 'cursor-pointer'
          )}
        >
          <Checkbox.Indicator>
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </div>

      <div className={cn('flex flex-col justify-between text-sm', errors || helper ? 'mt-2' : '')}>
        <AppInputHelper helper={helper} />
        <AppInputErrorsList errors={errors} />
      </div>
    </div>
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
