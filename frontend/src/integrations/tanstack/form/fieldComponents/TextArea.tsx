import { useFieldContext } from '@/integrations/tanstack/form/context';
import { cn } from '@/lib/utils';

import { FieldErrorTriangle, FieldLabel } from './shared';
import { FieldErrors } from '../newFieldComponets/shared';

export function TextAreaField({ label, rows = 3 }: { label: string; rows?: number }) {
  const field = useFieldContext<string>();
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <div className="flex flex-col" data-invalid={hasError || undefined}>
      <FieldLabel htmlFor={field.name} label={label} />
      <div className="relative flex">
        <textarea
          id={field.name}
          name={field.name}
          value={field.state.value}
          rows={rows}
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.target.value)}
          aria-invalid={hasError || undefined}
          className={cn(
            'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900',
            'resize-none transition duration-300 ease-in-out',
            'focus:border-blue-500 focus:shadow focus:ring-blue-500 focus:outline-none',
            hasError ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
          )}
        />
        <FieldErrorTriangle hasError={hasError} mode="absolute" />
      </div>
      <FieldErrors meta={field.state.meta} />
    </div>
  );
}
