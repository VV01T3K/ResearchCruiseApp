import { cva } from 'class-variance-authority';
import React from 'react';

import { useFieldContext } from '@/integrations/tanstack/form/context';
import { cn } from '@/lib/utils';

import { FieldErrorTriangle, FieldLabel } from '../fieldComponents/shared';
import { FieldErrors } from '@/integrations/tanstack/form/newFieldComponets/shared';

type TextFieldProps = {
  label?: string;
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
  placeholder,
  type,
  autoComplete,
  disabled,
  endAdornment,
  showAllErrors,
}: TextFieldProps) {
  const field = useFieldContext<string>();
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  const input = (
    <div className={'relative flex'}>
      <input
        id={field.name}
        name={field.name}
        type={type}
        autoComplete={autoComplete}
        value={field.state.value}
        placeholder={placeholder}
        disabled={disabled}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={hasError || undefined}
        className={cn(
          textFieldInputVariants({
            hasError,
            hasAdornment: hasError || Boolean(endAdornment),
          })
        )}
      />
      {!hasError && endAdornment ? (
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">{endAdornment}</div>
      ) : null}
      <FieldErrorTriangle hasError={hasError} mode="absolute" />
    </div>
  );

  return (
    <div className="flex flex-col" data-invalid={hasError || undefined}>
      <FieldLabel htmlFor={field.name} label={label} />
      {input}
      <FieldErrors meta={field.state.meta} showAllErrors={showAllErrors} />
    </div>
  );
}

export function EmailField(props: Omit<React.ComponentProps<typeof TextField>, 'type'>) {
  return <TextField {...props} type="email" />;
}

export function PasswordField(props: Omit<React.ComponentProps<typeof TextField>, 'type'>) {
  return <TextField {...props} type="password" />;
}
