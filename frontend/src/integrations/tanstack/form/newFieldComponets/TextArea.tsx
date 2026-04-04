import { Field as BaseField } from '@base-ui/react/field';
import { cva } from 'class-variance-authority';
import { TriangleAlert } from 'lucide-react';
import React from 'react';

import { useFieldContext } from '@/integrations/tanstack/form/context';
import { cn } from '@/lib/utils';

import { FieldErrors } from '@/integrations/tanstack/form/newFieldComponets/shared';

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
        <textarea
          id={field.name}
          name={field.name}
          value={field.state.value}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.target.value)}
          className={cn(textAreaFieldVariants({ hasError }), 'resize-none', hasError ? 'pr-11' : undefined)}
        />
        {hasError ? (
          <div className="pointer-events-none absolute top-3 right-3 flex items-center">
            <TriangleAlert className="h-5 w-5 text-danger" />
          </div>
        ) : null}
      </div>
      <BaseField.Error match={hasError}>
        <FieldErrors meta={field.state.meta} showAllErrors={showAllErrors} />
      </BaseField.Error>
    </BaseField.Root>
  );
}
