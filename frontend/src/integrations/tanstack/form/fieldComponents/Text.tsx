import React from 'react';

import { cn } from '@/lib/utils';

import { FieldErrorsBlock, FieldErrorTriangle, FieldLabel, useNormalizedFieldErrors } from './shared';

export function Text({
  label,
  placeholder,
  type,
  autoComplete,
  inline,
  children,
}: {
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  inline?: boolean;
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
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={hasError || undefined}
        className={cn(
          inline ? 'flex-1' : '',
          'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900',
          'resize-none transition duration-300 ease-in-out',
          'focus:border-blue-500 focus:shadow focus:ring-blue-500 focus:outline-none',
          hasError ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
        )}
      />
      <FieldErrorTriangle hasError={hasError} mode="absolute" />
    </div>
  );

  return (
    <div className="flex flex-col" data-invalid={hasError || undefined}>
      <FieldLabel htmlFor={field.name} label={label} className={inline ? 'sr-only' : undefined} />
      {inline ? <div className="flex items-center gap-2">{input}{children}</div> : input}
      <FieldErrorsBlock errors={normalizedErrors} />
    </div>
  );
}

export function Email(props: Omit<React.ComponentProps<typeof Text>, 'type'>) {
  return <Text {...props} type="email" />;
}

export function Password(props: Omit<React.ComponentProps<typeof Text>, 'type'>) {
  return <Text {...props} type="password" />;
}
