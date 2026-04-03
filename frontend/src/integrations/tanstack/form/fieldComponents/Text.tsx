import React from 'react';

import { cn } from '@/lib/utils';

import { FieldErrorsBlock, FieldErrorTriangle, FieldLabel, useNormalizedFieldErrors } from './shared';

export function TextField({
  label,
  placeholder,
  type,
  autoComplete,
  disabled,
  inline,
  endAdornment,
  children,
}: {
  label?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  disabled?: boolean;
  inline?: boolean;
  endAdornment?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const { field, hasError, normalizedErrors } = useNormalizedFieldErrors<string>();
  const InputElement = type === 'textarea' ? 'textarea' : 'input';

  const input = (
    <div className="relative flex">
      <InputElement
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
          inline ? 'flex-1' : '',
          'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900',
          hasError || endAdornment ? 'pr-11' : '',
          'resize-none transition duration-300 ease-in-out',
          'focus:border-blue-500 focus:shadow focus:ring-blue-500 focus:outline-none',
          'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500',
          hasError ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
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
      <FieldLabel htmlFor={field.name} label={label} className={inline ? 'sr-only' : undefined} />
      {inline ? (
        <div className="flex items-center gap-2">
          {input}
          {children}
        </div>
      ) : (
        input
      )}
      <FieldErrorsBlock errors={normalizedErrors} />
    </div>
  );
}

export function EmailField(props: Omit<React.ComponentProps<typeof TextField>, 'type'>) {
  return <TextField {...props} type="email" />;
}

export function PasswordField(props: Omit<React.ComponentProps<typeof TextField>, 'type'>) {
  return <TextField {...props} type="password" />;
}
