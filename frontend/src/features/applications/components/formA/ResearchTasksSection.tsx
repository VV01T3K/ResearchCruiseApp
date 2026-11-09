import { mapResearchTaskToValues } from '@/features/applications/schemas/formA.schema';
import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { Table } from '@/components/shared/table/Table';
import { TableDeleteRowButton } from '@/components/shared/table/TableDeleteRowButton';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { groupBy } from '@/lib/utils';
import { AddMenuButton } from '@/features/applications/components/form-controls/AddMenuButton';
import { ResearchTaskThumbnail } from '@/features/applications/components/formA/research-task-thumbnails/ResearchTaskThumbnail';
import { ResearchTaskDetails } from '@/features/applications/components/formA/research-task-details/ResearchTaskDetails';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormAViewModel } from '@/features/applications/models/formA-view-model';
import { formADefaultValues } from '@/features/applications/schemas/formA.schema';
import {
  getEmptyTask,
  getTaskName,
  ResearchTaskValues,
  taskTypes,
} from '@/features/applications/schemas/types/ResearchTaskValues';

export function ResearchTasksSection({ context }: { context: FormAViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  const { isReadonly, initValues } = context;

  function getColumns(removeRow: (index: number) => void): ColumnDef<ResearchTaskValues>[] {
    return [
      {
        header: 'Lp.',
        cell: ({ row }) => `${row.index + 1}. `,
        size: 5,
      },
      {
        header: 'Zadanie',
        accessorFn: (row) => getTaskName(row.type),
        cell: ({ row }) => (
          <form.AppField key={row.index} name={`researchTasks[${row.index}].type`}>
            {(field) => getTaskName(field.state.value) ?? 'Nieznany typ'}
          </form.AppField>
        ),
        size: 20,
      },
      {
        header: 'Szczegóły',
        cell: ({ row }) => <ResearchTaskDetails row={row} disabled={isReadonly} />,
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Akcje</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <TableDeleteRowButton
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
    <Accordion title="6. Zadania do zrealizowania w trakcie rejsu" expandedByDefault>
      <div>
        <form.AppField name="researchTasks" mode="array">
          {(field) => (
            <>
              <Table
                columns={getColumns((index) => {
                  field.removeValue(index);
                  field.handleBlur();
                })}
                data={field.state.value}
                showRequiredAsterisk
                buttons={() => [
                  <AddMenuButton
                    key="new"
                    options={taskTypes.map((type) => ({
                      label: getTaskName(type),
                      onSelect: () => {
                        field.pushValue(getEmptyTask(type));
                        field.handleBlur();
                      },
                    }))}
                    variant="primary"
                    disabled={isReadonly}
                  >
                    Dodaj nowe zadanie badawcze
                  </AddMenuButton>,
                  <AddMenuButton
                    key="historical"
                    options={groupBy(initValues.historicalResearchTasks, (x) => x.type ?? '').map(([type, tasks]) => ({
                      label: getTaskName(type),
                      items: tasks.map((task) => ({
                        label: [task.title, task.author, task.description].filter(Boolean).join(' '),
                        content: <ResearchTaskThumbnail task={task} />,
                        onSelect: () => {
                          field.pushValue(mapResearchTaskToValues(task));
                          field.handleBlur();
                        },
                      })),
                    }))}
                    variant="primaryOutline"
                    disabled={isReadonly}
                  >
                    Dodaj historyczne zadanie badawcze
                  </AddMenuButton>,
                ]}
                emptyTableMessage="Nie dodano żadnego zadania."
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
