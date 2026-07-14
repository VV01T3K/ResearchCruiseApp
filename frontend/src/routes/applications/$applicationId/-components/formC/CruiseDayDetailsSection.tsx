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
import { CruiseDayValues } from '@/routes/applications/$applicationId/-schemas/types/CruiseDayValues';

const cruiseDayDetailsColumns = (
  form: FormCFormApi,
  field: AnyFieldApi,
  hasFormBeenSubmitted: boolean,
  isReadonly: boolean
): ColumnDef<CruiseDayValues>[] => [
  {
    header: 'Dzień',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.number,
    cell: ({ row }) => (
      <form.Field
        name={`cruiseDaysDetails[${row.index}].number`}
        children={(field) => (
          <AppNumberInput
            name={field.name}
            value={field.state.value}
            onChange={field.setValue}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            minimum={0}
            type="integer"
          />
        )}
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
      <form.Field
        name={`cruiseDaysDetails[${row.index}].hours`}
        children={(field) => (
          <AppNumberInput
            name={field.name}
            value={field.state.value}
            onChange={field.setValue}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            minimum={0}
            type="integer"
          />
        )}
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
      <form.Field
        name={`cruiseDaysDetails[${row.index}].taskName`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value}
            onChange={field.setValue}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            placeholder="Nazwa zadania"
          />
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
      <form.Field
        name={`cruiseDaysDetails[${row.index}].region`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value}
            onChange={field.setValue}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            placeholder="Rejon zadania"
          />
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
      <form.Field
        name={`cruiseDaysDetails[${row.index}].position`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value}
            onChange={field.setValue}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            placeholder="Pozycja"
          />
        )}
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
      <form.Field
        name={`cruiseDaysDetails[${row.index}].comment`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value}
            onChange={field.setValue}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            placeholder="Uwagi"
          />
        )}
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
            field.removeValue(row.index);
            field.handleChange((prev: CruiseDayValues[]) => prev);
            field.handleBlur();
          }}
          disabled={isReadonly}
        />
      </div>
    ),
    size: 10,
  },
];

export const CruiseDayDetailsSection = withForm({
  defaultValues: formCDefaultValues,
  props: {} as { context: FormCViewModel },
  render: function CruiseDayDetailsSection({ form, context }) {
    const { hasFormBeenSubmitted, isReadonly } = context;

    return (
      <AppAccordion
        title="13. Szczegółowy plan zadań zrealizowanych podczas rejsu"
        expandedByDefault
        data-testid="form-c-cruise-day-details-section"
      >
        <form.Field
          name="cruiseDaysDetails"
          mode="array"
          children={(field) => (
            <AppTable
              data={field.state.value}
              columns={cruiseDayDetailsColumns(form, field, hasFormBeenSubmitted, isReadonly)}
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
                    field.handleChange((prev: CruiseDayValues[]) => prev);
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
  },
});
