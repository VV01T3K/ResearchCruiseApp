import { mapResearchTaskToValues } from '@/features/applications/schemas/formA.schema';
import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { Table } from '@/components/shared/table/Table';
import { ActionsHeader, DeleteRowCell } from '@/integrations/tanstack/table/DeleteRowCell';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { groupBy } from '@/lib/utils';
import { AddMenuButton } from '@/features/applications/components/form-controls/AddMenuButton';
import { ResearchTaskThumbnail } from '@/features/applications/components/research-tasks/ResearchTaskThumbnail';
import { ResearchTaskDetails } from '@/features/applications/components/research-tasks/ResearchTaskDetails';
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

  function getColumns(): ColumnDef<ResearchTaskValues>[] {
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
        cell: ({ row }) => (
          <ResearchTaskDetails
            form={form}
            fields={`researchTasks[${row.index}]`}
            type={row.original.type}
            rowLabel={`wiersz ${row.index + 1}`}
            disabled={isReadonly}
          />
        ),
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
    <Accordion title="6. Zadania do zrealizowania w trakcie rejsu" expandedByDefault>
      <div>
        <form.AppField name="researchTasks" mode="array">
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
