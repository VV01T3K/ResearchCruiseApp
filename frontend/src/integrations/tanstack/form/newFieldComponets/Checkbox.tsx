import { cva } from 'class-variance-authority';
import React from 'react';

import { Checkbox } from '@/components/shadcn/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/shadcn/ui/field';
import { cn } from '@/lib/utils';

import { useFieldContext } from '../context';

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
  'border-gray-300 bg-white text-white transition-all duration-300 hover:border-gray-400',
  {
    variants: {
      checked: {
        true: 'border-primary bg-primary text-white',
        false: '',
      },
      hasError: {
        true: 'border-danger aria-invalid:border-danger',
      },
    },
  }
);

export function CheckboxField({ label, className, labelPosition = 'left' }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const checked = field.state.value === true;

  return (
    <div
      className={cn('flex flex-col gap-2', className)}
      data-invalid={isInvalid || undefined}
      data-dirty={field.state.meta.isDirty || undefined}
      data-touched={field.state.meta.isTouched || undefined}
    >
      <Field
        orientation={labelPosition === 'left' ? 'horizontal' : 'vertical'}
        data-invalid={isInvalid || undefined}
        className={cn(checkboxFieldLayoutVariants({ labelPosition }), 'gap-2')}
      >
        {label ? (
          <FieldLabel htmlFor={field.name} className={checkboxFieldLabelVariants({ labelPosition })}>
            {label}
          </FieldLabel>
        ) : null}
        <Checkbox
          id={field.name}
          name={field.name}
          checked={checked}
          aria-invalid={isInvalid || undefined}
          onCheckedChange={(nextChecked) => field.handleChange(nextChecked === true)}
          onBlur={field.handleBlur}
          className={cn(
            checkboxFieldRootVariants({
              checked,
              hasError: isInvalid,
            }),
            'cursor-pointer'
          )}
        />
      </Field>
      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
    </div>
  );
}
