import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Button } from '@/components/shared/Button';
import { Table } from '@/components/shared/table/Table';
import { ActionsHeader, DeleteRowCell } from '@/integrations/tanstack/table/DeleteRowCell';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormCFormApi, FormCViewModel } from '@/features/applications/models/formC-view-model';
import { formCDefaultValues } from '@/features/applications/schemas/formC.schema';
import { CollectedSampleValues } from '@/features/applications/schemas/types/CollectedSampleValues';

const collectedSamplesColumns = (form: FormCFormApi, isReadonly: boolean): ColumnDef<CollectedSampleValues>[] => [
  {
    header: 'Rodzaj materiału badawczego/próbek/danych',
    cell: ({ row }) => (
      <form.AppField name={`collectedSamples[${row.index}].type`}>
        {(field) => (
          <field.TextField
            aria-label={`Rodzaj materiału, wiersz ${row.index + 1}`}
            placeholder="Wpisz rodzaj materiału badawczego/próbek/danych"
            disabled={isReadonly}
          />
        )}
      </form.AppField>
    ),
    size: 30,
  },
  {
    header: 'Ilość',
    cell: ({ row }) => (
      <form.AppField name={`collectedSamples[${row.index}].amount`}>
        {(field) => <field.NumberField aria-label={`Ilość, wiersz ${row.index + 1}`} disabled={isReadonly} />}
      </form.AppField>
    ),
    size: 5,
  },
  {
    header: 'Analizy na zebranym materiale badawczym, przeprowadzone podczas rejsu lub do przeprowadzenia po rejsie',
    cell: ({ row }) => (
      <form.AppField name={`collectedSamples[${row.index}].analysis`}>
        {(field) => (
          <field.TextField
            aria-label={`Zakres analiz, wiersz ${row.index + 1}`}
            placeholder="Wpisz zakres analiz"
            disabled={isReadonly}
          />
        )}
      </form.AppField>
    ),
    size: 30,
  },
  {
    header: 'Czy dane upubliczniono? (jeśli tak, to w jaki sposób, czy przesłano je np. do BHMW)',
    cell: ({ row }) => (
      <form.AppField name={`collectedSamples[${row.index}].publishing`}>
        {(field) => (
          <field.TextField
            aria-label={`Upublicznienie danych, wiersz ${row.index + 1}`}
            placeholder="Wpisz informacje o upublicznieniu danych"
            disabled={isReadonly}
          />
        )}
      </form.AppField>
    ),
    size: 30,
  },
  {
    id: 'actions',
    header: ActionsHeader,
    cell: DeleteRowCell,
    size: 5,
  },
];

export function CollectedSamplesSection({ context }: { context: FormCViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formCDefaultValues });
  const { isReadonly } = context;
  const columns = collectedSamplesColumns(form, isReadonly);

  return (
    <Accordion title="16. Lista próbek pobranych i poddanych analizie podczas rejsu" expandedByDefault>
      <form.AppField name="collectedSamples" mode="array">
        {(field) => (
          <Table
            data={field.state.value}
            columns={columns}
            meta={{ removeRow: (index) => field.removeValue(index) }}
            buttons={() => [
              <Button
                key="new"
                onClick={() => {
                  field.pushValue({
                    type: '',
                    amount: 0,
                    analysis: '',
                    publishing: '',
                  } satisfies CollectedSampleValues);
                  field.handleBlur();
                }}
              >
                Dodaj próbkę
              </Button>,
            ]}
            emptyTableMessage="Nie dodano żadnej próbki"
            disabled={isReadonly}
          />
        )}
      </form.AppField>
    </Accordion>
  );
}
