import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppYearPickerInput } from '@/components/shared/inputs/dates/AppYearPickerInput';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/lib/form-errors';
import { DropdownElementSelectorButton } from '@/routes/applications/$applicationId/-components/form-controls/DropdownElementSelectorButton';
import { withForm } from '@/lib/form';
import type { FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';
import { SpubTaskValues } from '@/routes/applications/$applicationId/-schemas/types/SpubTaskValues';

export const SPUBTasksSection = withForm({
  defaultValues: formCDefaultValues,
  props: {} as { context: FormCViewModel },
  render: function SPUBTasksSection({ form, context }) {
    const { isReadonly, formAInitValues } = context;

    function getColumns(removeRow: (index: number) => void): ColumnDef<SpubTaskValues>[] {
      return [
        {
          header: 'Lp.',
          cell: ({ row }) => `${row.index + 1}.`,
          size: 5,
        },
        {
          header: 'Rok rozpoczęcia',
          accessorFn: (row) => row.yearFrom,
          enableColumnFilter: false,
          enableSorting: false,
          cell: ({ row }) => (
            <form.AppField
              name={`spubTasks[${row.index}].yearFrom`}
              listeners={{
                onChange: ({ value }) => {
                  const yearTo = form.getFieldValue(`spubTasks[${row.index}].yearTo`);
                  if (value && yearTo && parseInt(value) > parseInt(yearTo)) {
                    form.setFieldValue(`spubTasks[${row.index}].yearTo`, value);
                  }
                },
              }}
              children={(field) => (
                <AppYearPickerInput
                  name={field.name}
                  value={field.state.value ? parseInt(field.state.value) : undefined}
                  onChange={(e) => field.handleChange(e?.toString() ?? '')}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta)}
                  disabled={isReadonly}
                />
              )}
            />
          ),
          size: 20,
        },
        {
          header: 'Rok zakończenia',
          accessorFn: (row) => row.yearTo,
          enableColumnFilter: false,
          enableSorting: false,
          cell: ({ row }) => (
            <form.AppField
              name={`spubTasks[${row.index}].yearTo`}
              children={(field) => (
                <AppYearPickerInput
                  name={field.name}
                  value={field.state.value ? parseInt(field.state.value) : undefined}
                  onChange={(e) => field.handleChange(e?.toString() ?? '')}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta)}
                  disabled={isReadonly}
                />
              )}
            />
          ),
          size: 20,
        },
        {
          header: 'Nazwa zadania',
          accessorFn: (row) => row.name,
          enableColumnFilter: false,
          enableSorting: false,
          cell: ({ row }) => (
            <form.AppField
              name={`spubTasks[${row.index}].name`}
              children={(field) => (
                <field.SelectField
                  allOptions={formAInitValues?.standardSpubTasks.map((taskName) => ({
                    value: taskName,
                    inlineLabel: taskName,
                  }))}
                  disabled={isReadonly}
                />
              )}
            />
          ),
          size: 50,
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
          size: 5,
        },
      ];
    }

    return (
      <AppAccordion
        title="11. Zadania SPUB, z którymi pokrywają się zadania zrealizowane na rejsie"
        expandedByDefault
        data-testid="form-c-spub-tasks-section"
      >
        <div>
          <form.AppField
            name="spubTasks"
            mode="array"
            children={(field) => (
              <>
                <AppTable
                  columns={getColumns((index) => {
                    field.removeValue(index);
                    field.handleChange((prev) => prev);
                    field.handleBlur();
                  })}
                  data={field.state.value}
                  buttons={() => [
                    <AppButton
                      key="new"
                      onClick={() => {
                        field.pushValue({ name: '', yearFrom: '', yearTo: '' });
                        field.handleChange((prev) => prev);
                        field.handleBlur();
                      }}
                      disabled={isReadonly}
                    >
                      Dodaj
                    </AppButton>,
                    <DropdownElementSelectorButton
                      key="historical"
                      options={formAInitValues.historicalSpubTasks.map((task) => ({
                        value: JSON.stringify(task),
                        content: `${task.name} (${task.yearFrom} - ${task.yearTo})`,
                        onClick: () => {
                          field.pushValue(task);
                          field.handleChange((prev) => prev);
                          field.handleBlur();
                        },
                      }))}
                      variant="primaryOutline"
                      disabled={isReadonly}
                    >
                      Dodaj historyczne zadanie
                    </DropdownElementSelectorButton>,
                  ]}
                  emptyTableMessage="Brak zadań SPUB"
                  variant="form"
                  disabled={isReadonly}
                  errors={getErrors(field.state.meta)}
                />
                <AppInputErrorsList errors={getErrors(field.state.meta)} />
              </>
            )}
          />
        </div>
      </AppAccordion>
    );
  },
});
