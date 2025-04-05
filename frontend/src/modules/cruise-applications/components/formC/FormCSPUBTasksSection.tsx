import { FieldApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppButton } from '@/core/components/AppButton';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppYearPickerInput } from '@/core/components/inputs/dates/AppYearPickerInput';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { getErrors } from '@/core/lib/utils';
import { CruiseApplicationDropdownElementSelectorButton } from '@/cruise-applications/components/common/CruiseApplicationDropdownElementSelectorButton';
import { useFormC } from '@/cruise-applications/contexts/FormCContext';
import { FormCDto } from '@/cruise-applications/models/FormCDto';
import { SpubTaskDto } from '@/cruise-applications/models/SpubTaskDto';

export function FormCSPUBTasksSection() {
  const { form, isReadonly, formAInitValues, hasFormBeenSubmitted } = useFormC();

  function getColumns(
    field: FieldApi<FormCDto, 'spubTasks', undefined, undefined, SpubTaskDto[]>
  ): ColumnDef<SpubTaskDto>[] {
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
          <form.Field
            name={`spubTasks[${row.index}].yearFrom`}
            children={(field) => (
              <AppYearPickerInput
                name={field.name}
                value={field.state.value ? parseInt(field.state.value) : undefined}
                onChange={(e) => field.handleChange(e?.toString() ?? '')}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                required
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
          <form.Field
            name={`spubTasks[${row.index}].yearTo`}
            children={(field) => (
              <AppYearPickerInput
                name={field.name}
                value={field.state.value ? parseInt(field.state.value) : undefined}
                onChange={(e) => field.handleChange(e?.toString() ?? '')}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                required
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
          <form.Field
            name={`spubTasks[${row.index}].name`}
            children={(field) => (
              <AppInput
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                required
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
                field.removeValue(row.index);
                field.handleChange((prev) => prev);
                field.handleBlur();
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
    <AppAccordion title="11. Zadania SPUB, z którymi pokrywają się zadania zrealizowane na rejsie" expandedByDefault>
      <div>
        <form.Field
          name="spubTasks"
          mode="array"
          children={(field) => (
            <>
              <AppTable
                columns={getColumns(field)}
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
                  <CruiseApplicationDropdownElementSelectorButton
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
                  </CruiseApplicationDropdownElementSelectorButton>,
                ]}
                emptyTableMessage="Brak zadań SPUB"
                variant="form"
                disabled={isReadonly}
              />
              <AppInputErrorsList errors={getErrors(field.state.meta, hasFormBeenSubmitted)} />
            </>
          )}
        />
      </div>
    </AppAccordion>
  );
}
