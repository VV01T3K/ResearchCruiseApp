import { useStore } from '@tanstack/react-form';
import type { ReactNode } from 'react';

import { CruiseApplicationPeriodInput } from '@/components/applications/common/CruiseApplicationPeriodInput';
import { useFieldContext } from '@/integrations/tanstack/form/context';
import { normalizeErrors } from '@/integrations/tanstack/form/fieldComponents/shared';

import { fromCruisePeriod, periodSelectionOptions, toCruisePeriod, type ExperimentCruisePeriod } from './-form-a';

export function SectionCard({
  number,
  title,
  description,
  children,
  testId,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
  testId?: string;
}) {
  return (
    <section
      className="rounded-3xl border border-gray-200 bg-white/95 p-6 shadow-sm ring-1 ring-black/3 backdrop-blur-sm"
      data-testid={testId}
    >
      <div className="mb-5 space-y-1">
        <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">Sekcja {number}</p>
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <p className="max-w-3xl text-sm text-gray-600">{description}</p>
      </div>

      {children}
    </section>
  );
}

export function ExperimentCruisePeriodField({
  label,
  maxValues,
}: {
  label: string;
  maxValues?: ExperimentCruisePeriod;
}) {
  const field = useFieldContext<ExperimentCruisePeriod>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const normalizedErrors = field.state.meta.isTouched && errors.length > 0 ? normalizeErrors(errors) : undefined;

  return (
    <CruiseApplicationPeriodInput
      name={field.name}
      value={toCruisePeriod(field.state.value)}
      maxValues={toCruisePeriod(maxValues)}
      onChange={(value) => field.handleChange(fromCruisePeriod(value))}
      onBlur={field.handleBlur}
      errors={normalizedErrors?.map((error) => error.message)}
      label={label}
    />
  );
}

export function PeriodTypeField() {
  const field = useFieldContext<boolean>();

  return (
    <div className="flex flex-col">
      <label htmlFor={field.name} className="mb-2 block text-sm font-medium text-gray-900">
        Wybierz sposób określenia terminu rejsu
      </label>

      <select
        id={field.name}
        name={field.name}
        value={field.state.value ? 'precise' : 'period'}
        onChange={(event) => field.handleChange(event.target.value === 'precise')}
        onBlur={field.handleBlur}
        className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 transition duration-300 ease-in-out outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:ring-inset"
      >
        <option value="" disabled>
          Wybierz
        </option>
        {periodSelectionOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
