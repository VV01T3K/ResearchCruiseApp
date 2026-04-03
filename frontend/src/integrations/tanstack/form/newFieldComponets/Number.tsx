import { Field as BaseField } from '@base-ui/react/field';
import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { cva } from 'class-variance-authority';
import { Minus, Plus } from 'lucide-react';
import React from 'react';

import { useFieldContext } from '@/integrations/tanstack/form/context';
import { cn } from '@/lib/utils';

import { FieldErrors } from '@/integrations/tanstack/form/newFieldComponets/shared';

type NumberFieldProps = {
  label?: React.ReactNode;
  minimum?: number;
  maximum?: number;
  step?: number;
  type?: 'integer' | 'float';
  precision?: number;
  allowOutOfRange?: boolean;
  testId?: string;
};

const numberFieldInputVariants = cva(
  'block h-11 w-full min-w-0 border border-gray-300 bg-gray-50 py-2.5 text-center text-sm text-gray-900 transition duration-300 ease-in-out outline-none',
  {
    variants: {
      hasError: {
        true: 'border-danger text-danger focus:border-danger focus:ring-danger focus:text-gray-900',
        false: 'focus:border-blue-500 focus:ring-blue-500',
      },
    },
  }
);

const numberFieldButtonVariants = cva(
  'flex h-11 w-11 shrink-0 items-center justify-center border border-gray-300 bg-gray-100 px-2 text-gray-500 transition duration-150 ease-out outline-none hover:text-gray-900 active:scale-95 active:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:active:scale-100 disabled:active:bg-gray-100',
  {
    variants: {
      side: {
        left: 'rounded-l',
        right: 'rounded-r',
      },
      hasError: {
        true: 'border-danger focus:border-danger focus:ring-danger disabled:border-danger',
        false: 'focus:border-blue-500 focus:ring-blue-500 disabled:border-gray-200',
      },
    },
  }
);

export function NumberField({
  label,
  minimum,
  maximum,
  step = 1,
  type = 'integer',
  precision = 2,
  allowOutOfRange = false,
  testId,
}: NumberFieldProps) {
  const field = useFieldContext<number>();
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <BaseField.Root
      name={field.name}
      invalid={!field.state.meta.isValid}
      dirty={field.state.meta.isDirty}
      touched={field.state.meta.isTouched}
      className="flex flex-col"
      data-invalid={hasError || undefined}
    >
      {label ? (
        <BaseField.Label htmlFor={field.name} className="mb-2 block text-sm font-medium text-gray-900">
          {label}
        </BaseField.Label>
      ) : null}
      <BaseNumberField.Root
        id={field.name}
        name={field.name}
        value={field.state.value}
        min={minimum}
        max={maximum}
        step={step}
        allowOutOfRange={allowOutOfRange}
        format={{
          minimumFractionDigits: 0,
          maximumFractionDigits: type === 'float' ? precision : 0,
        }}
        onValueChange={(value) => {
          field.handleChange(value ?? 0);
        }}
        onValueCommitted={field.handleBlur}
      >
        <BaseNumberField.Group className="flex items-center">
          <BaseNumberField.Decrement
            aria-label="Decrease value"
            className={cn(
              numberFieldButtonVariants({ side: 'left', hasError }),
              'focus:relative focus:z-10 focus:shadow'
            )}
          >
            <Minus className="h-4 w-4" />
          </BaseNumberField.Decrement>
          <div className="relative flex-1">
            <BaseNumberField.Input
              data-testid={testId}
              onBlur={field.handleBlur}
              inputMode={type === 'float' ? 'decimal' : 'numeric'}
              className={cn(
                numberFieldInputVariants({
                  hasError,
                }),
                '-mx-px w-[calc(100%+2px)] focus:relative focus:z-10 focus:shadow'
              )}
            />
          </div>
          <BaseNumberField.Increment
            aria-label="Increase value"
            className={cn(
              numberFieldButtonVariants({ side: 'right', hasError }),
              'focus:relative focus:z-10 focus:shadow'
            )}
          >
            <Plus className="h-4 w-4" />
          </BaseNumberField.Increment>
        </BaseNumberField.Group>
      </BaseNumberField.Root>
      <BaseField.Error match={hasError}>
        <FieldErrors meta={field.state.meta} />
      </BaseField.Error>
    </BaseField.Root>
  );
}

export function IntegerField(props: Omit<NumberFieldProps, 'type' | 'precision'>) {
  return <NumberField {...props} type="integer" />;
}

export function FloatField(props: Omit<NumberFieldProps, 'type'> & { precision?: number }) {
  return <NumberField {...props} type="float" />;
}
