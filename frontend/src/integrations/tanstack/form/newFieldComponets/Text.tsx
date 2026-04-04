import { cva } from 'class-variance-authority';
import { TriangleAlert } from 'lucide-react';
import React from 'react';

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/shadcn/ui/field';
import { Input } from '@/components/shadcn/ui/input';
import { useFieldContext } from '@/integrations/tanstack/form/context';

type TextFieldProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  disabled?: boolean;
  endAdornment?: React.ReactNode;
  showAllErrors?: boolean;
};

const textFieldInputVariants = cva(
  'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 transition duration-300 ease-in-out focus-visible:border-blue-500 focus-visible:shadow focus-visible:ring-3 focus-visible:ring-blue-500/30',
  {
    variants: {
      hasError: {
        true: 'border-danger text-danger focus-visible:border-danger focus-visible:ring-danger/20 focus-visible:text-gray-900',
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
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field
      data-invalid={isInvalid || undefined}
      data-dirty={field.state.meta.isDirty || undefined}
      data-touched={field.state.meta.isTouched || undefined}
      data-disabled={disabled || undefined}
      className="flex flex-col"
    >
      {label ? (
        <FieldLabel htmlFor={field.name} className="mb-2 block text-sm font-medium text-gray-900">
          {label}
        </FieldLabel>
      ) : null}
      {description ? <FieldDescription className="mb-2 text-sm text-gray-600">{description}</FieldDescription> : null}
      <FieldContent className="gap-0">
        <div className="relative flex">
          <Input
            id={field.name}
            name={field.name}
            type={type}
            autoComplete={autoComplete}
            value={field.state.value}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={isInvalid || undefined}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
            className={textFieldInputVariants({
              hasError: isInvalid,
              hasAdornment: isInvalid || Boolean(endAdornment),
            })}
          />
          {isInvalid || endAdornment ? (
            <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center">
              {isInvalid ? <TriangleAlert className="h-5 w-5 text-danger" /> : endAdornment}
            </div>
          ) : null}
        </div>
        {isInvalid ? <FieldError errors={field.state.meta.errors} showAllErrors={showAllErrors} /> : null}
      </FieldContent>
    </Field>
  );
}

export function EmailField(props: Omit<React.ComponentProps<typeof TextField>, 'type'>) {
  return <TextField {...props} type="email" />;
}

export function PasswordField(props: Omit<React.ComponentProps<typeof TextField>, 'type'>) {
  return <TextField {...props} type="password" />;
}
