import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Field as BaseField } from '@base-ui/react/field';
import CheckLgIcon from 'bootstrap-icons/icons/check-lg.svg?react';
import { cva } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/lib/utils';

import { useFieldContext } from '../context';
import { FieldErrors } from './shared';

type CheckboxFieldProps = {
  label?: React.ReactNode;
  className?: string;
  labelPosition?: 'top' | 'left';
};

const checkboxFieldLayoutVariants = cva('flex items-center gap-2', {
  variants: {
    labelPosition: {
      left: 'flex-row',
      top: 'flex-col',
    },
  },
  defaultVariants: {
    labelPosition: 'left',
  },
});

const checkboxFieldLabelVariants = cva('block text-sm font-medium text-gray-900', {
  variants: {
    labelPosition: {
      left: 'mb-0',
      top: 'mb-2',
    },
  },
  defaultVariants: {
    labelPosition: 'left',
  },
});

const checkboxFieldRootVariants = cva(
  'flex h-4 w-4 items-center justify-center rounded-md border border-gray-300 transition-all duration-300',
  {
    variants: {
      checked: {
        true: 'border-primary bg-primary text-white',
        false: 'bg-white hover:border-gray-400',
      },
      hasError: {
        true: 'border-danger focus-visible:border-danger',
      },
    },
  }
);

export function CheckboxField({ label, className, labelPosition = 'left' }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  const isInvalid = !field.state.meta.isValid;
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const checked = field.state.value === true;

  return (
    <BaseField.Root
      name={field.name}
      invalid={isInvalid}
      dirty={field.state.meta.isDirty}
      touched={field.state.meta.isTouched}
      className={cn('flex flex-col', className)}
      data-invalid={hasError || undefined}
    >
      <div className={cn(checkboxFieldLayoutVariants({ labelPosition }))}>
        {label ? (
          <BaseField.Label className={cn(checkboxFieldLabelVariants({ labelPosition }))}>{label}</BaseField.Label>
        ) : null}
        <BaseCheckbox.Root
          id={field.name}
          name={field.name}
          checked={checked}
          onCheckedChange={(nextChecked) => field.handleChange(nextChecked === true)}
          onBlur={field.handleBlur}
          className={cn(
            checkboxFieldRootVariants({
              checked,
              hasError,
            }),
            'cursor-pointer'
          )}
        >
          <BaseCheckbox.Indicator>
            <CheckLgIcon className="h-4 w-4" />
          </BaseCheckbox.Indicator>
        </BaseCheckbox.Root>
      </div>
      <BaseField.Error match={hasError}>
        <FieldErrors meta={field.state.meta} />
      </BaseField.Error>
    </BaseField.Root>
  );
}
