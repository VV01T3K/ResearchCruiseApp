import { Field as BaseField } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { cva } from 'class-variance-authority';
import { TriangleAlert } from 'lucide-react';
import React from 'react';

import { useFieldContext } from '@/integrations/tanstack/form/context';
import { cn } from '@/lib/utils';

import { FieldErrors } from '@/integrations/tanstack/form/newFieldComponets/shared';

type TextFieldProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  disabled?: boolean;
  endAdornment?: React.ReactNode;
  children?: React.ReactNode;
  showAllErrors?: boolean;
};

const textFieldInputVariants = cva(
  'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 transition duration-300 ease-in-out focus:border-blue-500 focus:shadow focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500',
  {
    variants: {
      hasError: {
        true: 'border-danger ring-danger text-danger focus:border-danger focus:ring-danger focus:text-gray-900',
      },
      hasAdornment: {
        true: 'pr-11',
      },
    },
  }
);

export function TextField({
  label,
  description,
  placeholder,
  type,
  autoComplete,
  disabled,
  endAdornment,
  showAllErrors,
}: TextFieldProps) {
  const field = useFieldContext<string>();
  const isInvalid = !field.state.meta.isValid;
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <BaseField.Root
      name={field.name}
      invalid={isInvalid}
      dirty={field.state.meta.isDirty}
      touched={field.state.meta.isTouched}
      className="flex flex-col"
      data-invalid={hasError || undefined}
    >
      {label ? (
        <BaseField.Label className="mb-2 block text-sm font-medium text-gray-900">{label}</BaseField.Label>
      ) : null}
      {description ? (
        <BaseField.Description className="mb-2 text-sm text-gray-600">{description}</BaseField.Description>
      ) : null}
      <div className="relative flex">
        <BaseInput
          id={field.name}
          type={type}
          autoComplete={autoComplete}
          value={field.state.value}
          placeholder={placeholder}
          disabled={disabled}
          onBlur={field.handleBlur}
          onValueChange={field.handleChange}
          className={cn(
            textFieldInputVariants({
              hasError,
              hasAdornment: hasError || Boolean(endAdornment),
            })
          )}
        />
        {hasError || endAdornment ? (
          <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center">
            {hasError ? <TriangleAlert className="h-5 w-5 text-danger" /> : endAdornment}
          </div>
        ) : null}
      </div>
      <BaseField.Error match={hasError}>
        <FieldErrors meta={field.state.meta} showAllErrors={showAllErrors} />
      </BaseField.Error>
    </BaseField.Root>
  );
}

export function EmailField(props: Omit<React.ComponentProps<typeof TextField>, 'type'>) {
  return <TextField {...props} type="email" />;
}

export function PasswordField(props: Omit<React.ComponentProps<typeof TextField>, 'type'>) {
  return <TextField {...props} type="password" />;
}
