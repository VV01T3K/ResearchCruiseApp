import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormCFormApi, FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';
import { CruiseDayValues } from '@/routes/applications/$applicationId/-schemas/types/CruiseDayValues';

const cruiseDayDetailsColumns = (
  form: FormCFormApi,
  removeRow: (index: number) => void,
  isReadonly: boolean
): ColumnDef<CruiseDayValues>[] => [
  {
    header: 'Dzień',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.number,
    cell: ({ row }) => (
      <form.AppField
        name={`cruiseDaysDetails[${row.index}].number`}
        children={(field) => <field.NumberField disabled={isReadonly} minimum={0} type="integer" />}
      />
    ),
    size: 10,
  },
  {
    header: 'Liczba godzin',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.hours,
    cell: ({ row }) => (
      <form.AppField
        name={`cruiseDaysDetails[${row.index}].hours`}
        children={(field) => <field.NumberField disabled={isReadonly} minimum={0} type="integer" />}
      />
    ),
    size: 10,
  },
  {
    header: 'Nazwa zadania',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.taskName,
    cell: ({ row }) => (
      <form.AppField
        name={`cruiseDaysDetails[${row.index}].taskName`}
        children={(field) => (
          <field.TextField onChange={field.setValue} disabled={isReadonly} placeholder="Nazwa zadania" />
        )}
      />
    ),
    size: 20,
  },
  {
    header: 'Rejon zadania',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.region,
    cell: ({ row }) => (
      <form.AppField
        name={`cruiseDaysDetails[${row.index}].region`}
        children={(field) => (
          <field.TextField onChange={field.setValue} disabled={isReadonly} placeholder="Rejon zadania" />
        )}
      />
    ),
    size: 20,
  },
  {
    header: 'Pozycja',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.position,
    cell: ({ row }) => (
      <form.AppField
        name={`cruiseDaysDetails[${row.index}].position`}
        children={(field) => <field.TextField onChange={field.setValue} disabled={isReadonly} placeholder="Pozycja" />}
      />
    ),
    size: 20,
  },
  {
    header: 'Uwagi',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.comment,
    cell: ({ row }) => (
      <form.AppField
        name={`cruiseDaysDetails[${row.index}].comment`}
        children={(field) => <field.TextField onChange={field.setValue} disabled={isReadonly} placeholder="Uwagi" />}
      />
    ),
    size: 20,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <AppTableDeleteRowButton
          onClick={() => {
            removeRow(row.index);
          }}
          disabled={isReadonly}
        />
      </div>
    ),
    size: 10,
  },
];

export function CruiseDayDetailsSection({ context }: { context: FormCViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formCDefaultValues });
  const { isReadonly } = context;

  return (
    <AppAccordion
      title="13. Szczegółowy plan zadań zrealizowanych podczas rejsu"
      expandedByDefault
      data-testid="form-c-cruise-day-details-section"
    >
      <form.AppField
        name="cruiseDaysDetails"
        mode="array"
        children={(field) => (
          <AppTable
            data={field.state.value}
            columns={cruiseDayDetailsColumns(
              form,
              (index) => {
                field.removeValue(index);
                field.handleBlur();
              },
              isReadonly
            )}
            buttons={() => [
              <AppButton
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
              </AppButton>,
            ]}
            variant="form"
            disabled={isReadonly}
          />
        )}
      />
    </AppAccordion>
  );
}
