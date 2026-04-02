import { cn } from '@/lib/utils';

import { FieldErrorsBlock, FieldErrorTriangle, FieldLabel, useNormalizedFieldErrors } from './shared';

type NativeDateFieldProps = {
  label?: React.ReactNode;
  min?: string;
  max?: string;
  testId?: string;
};

export function NativeDateField({ label, min, max, testId }: NativeDateFieldProps) {
  const { field, hasError, normalizedErrors } = useNormalizedFieldErrors<string>();

  return (
    <div className="flex flex-col" data-invalid={hasError || undefined}>
      <FieldLabel htmlFor={field.name} label={label} />
      <div className="relative flex">
        <input
          id={field.name}
          name={field.name}
          type="date"
          value={field.state.value}
          min={min}
          max={max}
          onChange={(event) => field.handleChange(event.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={hasError || undefined}
          data-testid={testId}
          className={cn(
            'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900',
            'transition duration-300 ease-in-out',
            'focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-inset',
            hasError ? 'border-danger ring-danger text-danger ring-inset focus:text-gray-900' : ''
          )}
        />
        <FieldErrorTriangle hasError={hasError} mode="absolute" />
      </div>
      <FieldErrorsBlock errors={normalizedErrors} />
    </div>
  );
}
