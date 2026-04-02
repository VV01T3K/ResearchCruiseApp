import { cn, roundNumber } from '@/lib/utils';

import { FieldErrorsBlock, FieldErrorTriangle, FieldLabel, useNormalizedFieldErrors } from './shared';

type DualNumberFieldProps = {
  label?: React.ReactNode;
  rootTestId?: string;
  primaryLabel: string;
  secondaryLabel: string;
  primaryTestId?: string;
  secondaryTestId?: string;
  primaryMin?: number;
  primaryMax?: number;
  primaryStep?: number;
  secondaryMin?: number;
  secondaryMax?: number;
  secondaryStep?: number;
  primaryPrecision?: number;
  secondaryPrecision?: number;
  parseFieldValue?: (value: string | number) => number;
  formatFieldValue?: (value: number, previousValue: string | number) => string | number;
  normalizeCanonicalValue?: (value: number) => number;
  toPrimaryValue: (canonicalValue: number) => number;
  fromPrimaryValue: (displayValue: number) => number;
  toSecondaryValue: (canonicalValue: number) => number;
  fromSecondaryValue: (displayValue: number) => number;
};

const defaultParseFieldValue = (value: string | number) =>
  typeof value === 'number' ? value : Number.parseFloat(value || '0');

const defaultFormatFieldValue = (value: number, previousValue: string | number) =>
  typeof previousValue === 'number' ? value : value.toString();

export function DualNumberField({
  label,
  rootTestId,
  primaryLabel,
  secondaryLabel,
  primaryTestId,
  secondaryTestId,
  primaryMin,
  primaryMax,
  primaryStep = 1,
  secondaryMin,
  secondaryMax,
  secondaryStep = 1,
  primaryPrecision = 2,
  secondaryPrecision = 2,
  parseFieldValue = defaultParseFieldValue,
  formatFieldValue = defaultFormatFieldValue,
  normalizeCanonicalValue,
  toPrimaryValue,
  fromPrimaryValue,
  toSecondaryValue,
  fromSecondaryValue,
}: DualNumberFieldProps) {
  const { field, hasError, normalizedErrors } = useNormalizedFieldErrors<number | string>();
  const parsedValue = parseFieldValue(field.state.value);
  const safeValue = Number.isNaN(parsedValue) ? 0 : parsedValue;

  function updateValue(nextValue: number) {
    const normalizedValue = normalizeCanonicalValue ? normalizeCanonicalValue(nextValue) : nextValue;

    if (Number.isNaN(normalizedValue)) {
      return;
    }

    field.handleChange(formatFieldValue(normalizedValue, field.state.value));
  }

  return (
    <div className="flex flex-col" data-invalid={hasError || undefined} data-testid={rootTestId}>
      <input type="hidden" name={field.name} value={field.state.value} readOnly />
      <FieldLabel label={label} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-900">{primaryLabel}</span>
          <div className="relative flex">
            <input
              type="number"
              min={primaryMin}
              max={primaryMax}
              step={primaryStep}
              value={roundNumber(toPrimaryValue(safeValue), primaryPrecision)}
              onChange={(event) => {
                const nextValue = Number.parseFloat(event.target.value.replace(',', '.'));
                if (Number.isNaN(nextValue)) {
                  return;
                }

                updateValue(fromPrimaryValue(nextValue));
              }}
              onBlur={field.handleBlur}
              aria-invalid={hasError || undefined}
              data-testid={primaryTestId}
              className={cn(
                'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900',
                'transition duration-300 ease-in-out',
                'focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-inset',
                hasError ? 'border-danger ring-danger text-danger ring-inset focus:text-gray-900' : ''
              )}
            />
            <FieldErrorTriangle hasError={hasError} mode="absolute" />
          </div>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-900">{secondaryLabel}</span>
          <div className="relative flex">
            <input
              type="number"
              min={secondaryMin}
              max={secondaryMax}
              step={secondaryStep}
              value={roundNumber(toSecondaryValue(safeValue), secondaryPrecision)}
              onChange={(event) => {
                const nextValue = Number.parseFloat(event.target.value.replace(',', '.'));
                if (Number.isNaN(nextValue)) {
                  return;
                }

                updateValue(fromSecondaryValue(nextValue));
              }}
              onBlur={field.handleBlur}
              aria-invalid={hasError || undefined}
              data-testid={secondaryTestId}
              className={cn(
                'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900',
                'transition duration-300 ease-in-out',
                'focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-inset',
                hasError ? 'border-danger ring-danger text-danger ring-inset focus:text-gray-900' : ''
              )}
            />
            <FieldErrorTriangle hasError={hasError} mode="absolute" />
          </div>
        </label>
      </div>

      <FieldErrorsBlock errors={normalizedErrors} />
    </div>
  );
}
