import { mapSpubTaskToValues } from '@/features/applications/schemas/formA.schema';
import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Button } from '@/components/shared/Button';
import { YearPickerInput } from '@/components/shared/inputs/dates/YearPickerInput';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { Table } from '@/components/shared/table/Table';
import { ActionsHeader, DeleteRowCell } from '@/integrations/tanstack/table/DeleteRowCell';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { AddMenuButton } from '@/features/applications/components/form-controls/AddMenuButton';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormCViewModel } from '@/features/applications/models/formC-view-model';
import { formCDefaultValues } from '@/features/applications/schemas/formC.schema';
import { SpubTaskValues } from '@/features/applications/schemas/types/SpubTaskValues';

export function SPUBTasksSection({ context }: { context: FormCViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formCDefaultValues });
  const { isReadonly, formAInitValues } = context;

  function getColumns(): ColumnDef<SpubTaskValues>[] {
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
          >
            {(field) => (
              <YearPickerInput
                name={field.name}
                value={field.state.value ? parseInt(field.state.value) : undefined}
                onChange={(e) => field.handleChange(e?.toString() ?? '')}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, form.state.submissionAttempts)}
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
        size: 20,
      },
      {
        header: 'Rok zakończenia',
        accessorFn: (row) => row.yearTo,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <form.AppField name={`spubTasks[${row.index}].yearTo`}>
            {(field) => (
              <YearPickerInput
                name={field.name}
                value={field.state.value ? parseInt(field.state.value) : undefined}
                onChange={(e) => field.handleChange(e?.toString() ?? '')}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, form.state.submissionAttempts)}
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
        size: 20,
      },
      {
        header: 'Nazwa zadania',
        accessorFn: (row) => row.name,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <form.AppField name={`spubTasks[${row.index}].name`}>
            {(field) => (
              <field.SelectField
                aria-label={`Nazwa zadania SPUB, wiersz ${row.index + 1}`}
                allOptions={formAInitValues?.standardSpubTasks.map((taskName) => ({
                  value: taskName,
                  inlineLabel: taskName,
                }))}
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
        size: 50,
      },
      {
        id: 'actions',
        header: ActionsHeader,
        cell: DeleteRowCell,
        size: 5,
      },
    ];
  }
  const columns = getColumns();

  return (
    <Accordion title="11. Zadania SPUB, z którymi pokrywają się zadania zrealizowane na rejsie" expandedByDefault>
      <div>
        <form.AppField name="spubTasks" mode="array">
          {(field) => (
            <>
              <Table
                columns={columns}
                meta={{
                  removeRow: (index) => {
                    field.removeValue(index);
                    field.handleBlur();
                  },
                }}
                data={field.state.value}
                buttons={() => [
                  <Button
                    key="new"
                    onClick={() => {
                      field.pushValue({ name: '', yearFrom: '', yearTo: '' });
                      field.handleBlur();
                    }}
                    disabled={isReadonly}
                  >
                    Dodaj
                  </Button>,
                  <AddMenuButton
                    key="historical"
                    options={formAInitValues.historicalSpubTasks.map((task) => ({
                      label: `${task.name} (${task.yearFrom} - ${task.yearTo})`,
                      onSelect: () => {
                        field.pushValue(mapSpubTaskToValues(task));
                        field.handleBlur();
                      },
                    }))}
                    variant="primaryOutline"
                    disabled={isReadonly}
                  >
                    Dodaj historyczne zadanie
                  </AddMenuButton>,
                ]}
                emptyTableMessage="Brak zadań SPUB"
                disabled={isReadonly}
                errors={getErrors(field.state.meta, form.state.submissionAttempts)}
              />
              <InputErrorsList errors={getErrors(field.state.meta, form.state.submissionAttempts)} />
            </>
          )}
        </form.AppField>
      </div>
    </Accordion>
  );
}
