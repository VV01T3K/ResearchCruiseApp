import { FieldApi, ReactFormExtendedApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppButton } from '@/core/components/AppButton';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { getErrors } from '@/core/lib/utils';
import { useFormC } from '@/cruise-applications/contexts/FormCContext';
import { CollectedSampleDto } from '@/cruise-applications/models/CollectedSampleDto';
import { FormCDto } from '@/cruise-applications/models/FormCDto';

const collectedSamplesColumns = (
  form: ReactFormExtendedApi<FormCDto, undefined>,
  field: FieldApi<FormCDto, 'collectedSamples', undefined, undefined, CollectedSampleDto[]>,
  hasFormBeenSubmitted: boolean,
  isReadonly: boolean
): ColumnDef<CollectedSampleDto>[] => [
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
            required
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
            value={parseInt(field.state.value, 10) || 0}
            onChange={(value) => field.handleChange(value.toString())}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            required
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
            required
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
            required
            disabled={isReadonly}
          />
        )}
      />
    ),
    size: 30,
  },
  {
    id: 'actions',
    cell: ({ row }) => <AppTableDeleteRowButton onClick={() => field.removeValue(row.index)} disabled={isReadonly} />,
    size: 5,
  },
];

export function FormCCollectedSamplesSection() {
  const { form, hasFormBeenSubmitted, isReadonly } = useFormC();

  return (
    <AppAccordion title="16. Lista próbek pobranych i poddanych analizie podczas rejsu" expandedByDefault>
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
                onClick={() => {
                  field.pushValue({
                    type: '',
                    amount: '0',
                    analysis: '',
                    publishing: '',
                  } as CollectedSampleDto);
                  field.handleChange((prev) => prev);
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
}
