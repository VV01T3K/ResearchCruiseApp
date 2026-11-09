import { hasErrors } from '@/components/inputs/invalidInput';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Field } from '@base-ui/react/field';
import { CheckIcon, MinusIcon } from '@phosphor-icons/react';
import React from 'react';

import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { InputErrorTriangle } from '@/components/shared/inputs/parts/InputErrorTriangle';
import { InputHelper } from '@/components/shared/inputs/parts/InputHelper';
import { InputLabel } from '@/components/shared/inputs/parts/InputLabel';
import { cn } from '@/lib/utils';

type Props = {
  name: string;
  checked: boolean;

  indeterminate?: boolean;
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
  'aria-label'?: string;
};
export function Checkbox({
  name,
  checked,
  indeterminate,
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
  'aria-label': ariaLabel,
}: Props) {
  return (
    <Field.Root invalid={hasErrors(errors)} className={cn('flex flex-col', className)}>
      <div className={cn('flex items-center gap-2', labelPosition === 'left' ? 'flex-row' : 'flex-col')}>
        {label && <Field.Label render={<InputLabel value={label} className="mb-0" />} />}

        <BaseCheckbox.Root
          name={name}
          checked={checked}
          indeterminate={indeterminate}
          onCheckedChange={(checked) => onChange?.(checked === true)}
          onBlur={onBlur}
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            'flex items-center justify-center rounded-md border border-border transition-[background-color,border-color,box-shadow,scale] duration-150 ease-out',
            sizes[size],
            (checked || indeterminate) && variants[variant][disabled ? 'disabled' : 'enabled'],
            !checked && !indeterminate && (disabled ? 'bg-surface-subtle' : 'bg-surface hover:border-neutral-400'),
            disabled ? 'cursor-default' : 'cursor-pointer active:scale-90',
            !hasErrors(errors) &&
              'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-hidden',
            hasErrors(errors) && 'border-danger hover:border-danger focus:ring-danger focus:ring-1 focus:outline-hidden'
          )}
        >
          <BaseCheckbox.Indicator className="flex size-full items-center justify-center">
            {indeterminate ? (
              <MinusIcon weight="bold" className="size-2/3" />
            ) : (
              <CheckIcon weight="bold" className="size-2/3" />
            )}
          </BaseCheckbox.Indicator>
        </BaseCheckbox.Root>
        <InputErrorTriangle errors={errors} />
      </div>

      <div className={cn('flex flex-col justify-between text-sm', hasErrors(errors) || helper ? 'mt-2' : '')}>
        {helper && <Field.Description render={<InputHelper helper={helper} />} />}
        {hasErrors(errors) && <Field.Error match render={<InputErrorsList errors={errors} />} />}
      </div>
    </Field.Root>
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
    enabled: 'bg-primary border-primary text-inverse-foreground hover:bg-primary-900 hover:border-primary-900',
    disabled: 'bg-primary-500 border-primary-500 text-primary-200',
  },
  success: {
    enabled: 'bg-success border-success text-inverse-foreground hover:bg-success-900 hover:border-success-900',
    disabled: 'bg-success-400 border-success-400 text-success-200',
  },
  danger: {
    enabled: 'bg-danger border-danger text-inverse-foreground hover:bg-danger-700 hover:border-danger-700',
    disabled: 'bg-danger-400 border-danger-400 text-danger-200',
  },
  warning: {
    enabled: 'bg-warning border-warning text-neutral-950 hover:bg-warning-400 hover:border-warning-400',
    disabled: 'bg-warning-100 border-warning-100 text-warning-800',
  },
  info: {
    enabled: 'bg-info border-info text-inverse-foreground hover:bg-info-700 hover:border-info-700',
    disabled: 'bg-info-200 border-info-200 text-info-100',
  },
  plain: {
    enabled: 'text-neutral-950',
    disabled: 'text-neutral-400 bg-surface-subtle',
  },
};
