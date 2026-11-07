import { hasErrors } from '@/components/inputs/invalidInput';
import { useInputAria } from '@/components/inputs/useInputAria';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
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
  const aria = useInputAria(errors, helper);
  return (
    <div className={cn('flex flex-col', className)}>
      <div className={cn('flex items-center gap-2', labelPosition === 'left' ? 'flex-row' : 'flex-col')}>
        <InputLabel name={aria.id} value={label} className="mb-0" />

        <BaseCheckbox.Root
          name={name}
          checked={checked}
          indeterminate={indeterminate}
          onCheckedChange={(checked) => onChange?.(checked === true)}
          onBlur={onBlur}
          disabled={disabled}
          {...aria.inputProps}
          aria-label={ariaLabel}
          className={cn(
            'flex items-center justify-center rounded-md border border-border transition-all duration-300',
            sizes[size],
            (checked || indeterminate) && variants[variant][disabled ? 'disabled' : 'enabled'],
            !checked && !indeterminate && (disabled ? 'bg-surface-subtle' : 'bg-surface hover:border-neutral-400'),
            disabled ? 'cursor-default' : 'cursor-pointer',
            hasErrors(errors) && 'border-danger hover:border-danger focus:ring-danger focus:ring-1 focus:outline-hidden'
          )}
        >
          <BaseCheckbox.Indicator>{indeterminate ? <MinusIcon /> : <CheckIcon />}</BaseCheckbox.Indicator>
        </BaseCheckbox.Root>
        <InputErrorTriangle errors={errors} />
      </div>

      <div className={cn('flex flex-col justify-between text-sm', hasErrors(errors) || helper ? 'mt-2' : '')}>
        <InputHelper id={aria.helperId} helper={helper} />
        <InputErrorsList id={aria.errorId} errors={errors} />
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
    enabled: 'bg-primary border-primary text-inverse-foreground',
    disabled: 'bg-primary-500 border-primary-500 text-primary-200',
  },
  success: {
    enabled: 'bg-success border-success text-inverse-foreground',
    disabled: 'bg-success-400 border-success-400 text-success-200',
  },
  danger: {
    enabled: 'bg-danger border-danger text-inverse-foreground',
    disabled: 'bg-danger-400 border-danger-400 text-danger-200',
  },
  warning: {
    enabled: 'bg-warning border-warning text-neutral-950',
    disabled: 'bg-warning-100 border-warning-100 text-warning-800',
  },
  info: {
    enabled: 'bg-info border-info text-inverse-foreground',
    disabled: 'bg-info-200 border-info-200 text-info-100',
  },
  plain: {
    enabled: 'text-neutral-950',
    disabled: 'text-neutral-400 bg-surface-subtle',
  },
};
