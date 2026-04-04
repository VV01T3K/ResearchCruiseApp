import { cva } from 'class-variance-authority';
import { TriangleAlert } from 'lucide-react';
import React from 'react';

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/shadcn/ui/field';
import { Textarea } from '@/components/shadcn/ui/textarea';
import { useFieldContext } from '@/integrations/tanstack/form/context';
import { cn } from '@/lib/utils';

type TextAreaFieldProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  showAllErrors?: boolean;
};

const textAreaFieldVariants = cva(
  'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 transition duration-300 ease-in-out focus:border-blue-500 focus:shadow focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500',
  {
    variants: {
      hasError: {
        true: 'border-danger ring-danger text-danger focus:border-danger focus:ring-danger focus:text-gray-900',
      },
    },
  }
);

export function TextAreaField({
  label,
  description,
  placeholder,
  rows = 3,
  disabled,
  showAllErrors,
}: TextAreaFieldProps) {
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
          <Textarea
            id={field.name}
            name={field.name}
            value={field.state.value}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={isInvalid || undefined}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
            className={cn(
              textAreaFieldVariants({ hasError: isInvalid }),
              'resize-none',
              isInvalid ? 'pr-11' : undefined
            )}
          />
          {isInvalid ? (
            <div className="pointer-events-none absolute top-3 right-3 flex items-center">
              <TriangleAlert className="h-5 w-5 text-danger" />
            </div>
          ) : null}
        </div>
        {isInvalid ? <FieldError errors={field.state.meta.errors} showAllErrors={showAllErrors} /> : null}
      </FieldContent>
    </Field>
  );
}
