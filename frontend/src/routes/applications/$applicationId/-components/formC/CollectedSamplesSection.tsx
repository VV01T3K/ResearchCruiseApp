import type { AnyFieldApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppNumberInput } from '@/components/shared/inputs/AppNumberInput';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { withForm } from '@/lib/form';
import { getErrors } from '@/lib/utils';
import type { FormCFormApi, FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';
import { CollectedSampleValues } from '@/routes/applications/$applicationId/-schemas/types/CollectedSampleValues';

const collectedSamplesColumns = (
  form: FormCFormApi,
  field: AnyFieldApi,
  hasFormBeenSubmitted: boolean,
  isReadonly: boolean
): ColumnDef<CollectedSampleValues>[] => [
  {
    header: 'Rodzaj materiału badawczego/próbek/danych',
    cell: ({ row }) => (
      <form.Field
        name={`collectedSamples[${row.index}].type`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            placeholder="Wpisz rodzaj materiału badawczego/próbek/danych"
            disabled={isReadonly}
          />
        )}
      />
    ),
    size: 30,
  },
  {
    header: 'Ilość',
    cell: ({ row }) => (
      <form.Field
        name={`collectedSamples[${row.index}].amount`}
        children={(field) => (
          <AppNumberInput
            name={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
          />
        )}
      />
    ),
    size: 5,
  },
  {
    header: 'Analizy na zebranym materiale badawczym, przeprowadzone podczas rejsu lub do przeprowadzenia po rejsie',
    cell: ({ row }) => (
      <form.Field
        name={`collectedSamples[${row.index}].analysis`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            placeholder="Wpisz zakres analiz"
            disabled={isReadonly}
          />
        )}
      />
    ),
    size: 30,
  },
  {
    header: 'Czy dane upubliczniono? (jeśli tak, to w jaki sposób, czy przesłano je np. do BHMW)',
    cell: ({ row }) => (
      <form.Field
        name={`collectedSamples[${row.index}].publishing`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            placeholder="Wpisz informacje o upublicznieniu danych"
            disabled={isReadonly}
          />
        )}
      />
    ),
    size: 30,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <AppTableDeleteRowButton onClick={() => field.removeValue(row.index)} disabled={isReadonly} />
      </div>
    ),
    size: 5,
  },
];

export const CollectedSamplesSection = withForm({
  defaultValues: formCDefaultValues,
  props: {} as { context: FormCViewModel },
  render: function CollectedSamplesSection({ form, context }) {
    const { hasFormBeenSubmitted, isReadonly } = context;

    return (
      <AppAccordion
        title="16. Lista próbek pobranych i poddanych analizie podczas rejsu"
        expandedByDefault
        data-testid="form-c-collected-samples-section"
      >
        <form.Field
          name="collectedSamples"
          mode="array"
          children={(field) => (
            <AppTable
              data={field.state.value}
              columns={collectedSamplesColumns(form, field, hasFormBeenSubmitted, isReadonly)}
              buttons={() => [
                <AppButton
                  key="new"
                  data-testid="form-c-add-sample-btn"
                  onClick={() => {
                    field.pushValue({
                      type: '',
                      amount: 0,
                      analysis: '',
                      publishing: '',
                    } satisfies CollectedSampleValues);
                    field.handleChange((prev: CollectedSampleValues[]) => prev);
                    field.handleBlur();
                  }}
                >
                  Dodaj próbkę
                </AppButton>,
              ]}
              variant="form"
              emptyTableMessage="Nie dodano żadnej próbki"
              disabled={isReadonly}
            />
          )}
        />
      </AppAccordion>
    );
  },
});
