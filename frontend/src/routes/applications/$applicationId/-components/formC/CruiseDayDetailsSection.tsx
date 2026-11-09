import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Button } from '@/components/shared/Button';
import { Table } from '@/components/shared/table/Table';
import { ActionsHeader, DeleteRowCell } from '@/integrations/tanstack/table/DeleteRowCell';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormCFormApi, FormCViewModel } from '@/features/applications/models/formC-view-model';
import { formCDefaultValues } from '@/features/applications/schemas/formC.schema';
import { CruiseDayValues } from '@/features/applications/schemas/types/CruiseDayValues';

const cruiseDayDetailsColumns = (form: FormCFormApi, isReadonly: boolean): ColumnDef<CruiseDayValues>[] => [
  {
    header: 'Dzień',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.number,
    cell: ({ row }) => (
      <form.AppField name={`cruiseDaysDetails[${row.index}].number`}>
        {(field) => (
          <field.NumberField
            aria-label={`Dzień, wiersz ${row.index + 1}`}
            disabled={isReadonly}
            minimum={0}
            type="integer"
          />
        )}
      </form.AppField>
    ),
    size: 10,
  },
  {
    header: 'Liczba godzin',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.hours,
    cell: ({ row }) => (
      <form.AppField name={`cruiseDaysDetails[${row.index}].hours`}>
        {(field) => (
          <field.NumberField
            aria-label={`Liczba godzin, wiersz ${row.index + 1}`}
            disabled={isReadonly}
            minimum={0}
            type="integer"
          />
        )}
      </form.AppField>
    ),
    size: 10,
  },
  {
    header: 'Nazwa zadania',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.taskName,
    cell: ({ row }) => (
      <form.AppField name={`cruiseDaysDetails[${row.index}].taskName`}>
        {(field) => (
          <field.TextField
            aria-label={`Nazwa zadania, wiersz ${row.index + 1}`}
            disabled={isReadonly}
            placeholder="Nazwa zadania"
          />
        )}
      </form.AppField>
    ),
    size: 20,
  },
  {
    header: 'Rejon zadania',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.region,
    cell: ({ row }) => (
      <form.AppField name={`cruiseDaysDetails[${row.index}].region`}>
        {(field) => (
          <field.TextField
            aria-label={`Rejon zadania, wiersz ${row.index + 1}`}
            disabled={isReadonly}
            placeholder="Rejon zadania"
          />
        )}
      </form.AppField>
    ),
    size: 20,
  },
  {
    header: 'Pozycja',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.position,
    cell: ({ row }) => (
      <form.AppField name={`cruiseDaysDetails[${row.index}].position`}>
        {(field) => (
          <field.TextField
            aria-label={`Pozycja, wiersz ${row.index + 1}`}
            disabled={isReadonly}
            placeholder="Pozycja"
          />
        )}
      </form.AppField>
    ),
    size: 20,
  },
  {
    header: 'Uwagi',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.comment,
    cell: ({ row }) => (
      <form.AppField name={`cruiseDaysDetails[${row.index}].comment`}>
        {(field) => (
          <field.TextField aria-label={`Uwagi, wiersz ${row.index + 1}`} disabled={isReadonly} placeholder="Uwagi" />
        )}
      </form.AppField>
    ),
    size: 20,
  },
  {
    id: 'actions',
    header: ActionsHeader,
    cell: DeleteRowCell,
    size: 10,
  },
];

export function CruiseDayDetailsSection({ context }: { context: FormCViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formCDefaultValues });
  const { isReadonly } = context;
  const columns = cruiseDayDetailsColumns(form, isReadonly);

  return (
    <Accordion title="13. Szczegółowy plan zadań zrealizowanych podczas rejsu" expandedByDefault>
      <form.AppField name="cruiseDaysDetails" mode="array">
        {(field) => (
          <Table
            data={field.state.value}
            columns={columns}
            meta={{
              removeRow: (index) => {
                field.removeValue(index);
                field.handleBlur();
              },
            }}
            buttons={() => [
              <Button
                key="new"
                onClick={() => {
                  field.pushValue({
                    number: 0,
                    hours: 0,
                    taskName: '',
                    region: '',
                    position: '',
                    comment: '',
                  });
                  field.handleBlur();
                }}
                variant="primary"
                disabled={isReadonly}
              >
                Dodaj
              </Button>,
            ]}
            disabled={isReadonly}
          />
        )}
      </form.AppField>
    </Accordion>
  );
}
