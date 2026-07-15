import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/lib/form-errors';
import { groupBy } from '@/lib/utils';
import { DropdownElementSelectorButton } from '@/routes/applications/$applicationId/-components/form-controls/DropdownElementSelectorButton';
import { ResearchTaskThumbnail } from '@/routes/applications/$applicationId/-components/formA/research-task-thumbnails/ResearchTaskThumbnail';
import { ResearchTaskDetails } from '@/routes/applications/$applicationId/-components/formA/research-task-details/ResearchTaskDetails';
import { useTypedAppFormContext } from '@/lib/form';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import {
  getEmptyTask,
  getTaskName,
  ResearchTaskValues,
  ResearchTaskType,
  taskTypes,
} from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

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
          <form.AppField
            key={row.index}
            name={`researchTasks[${row.index}].type`}
            children={(field) => getTaskName(field.state.value) ?? 'Nieznany typ'}
          />
        ),
        size: 20,
      },
      {
        header: 'Szczegóły',
        cell: ({ row }) => <ResearchTaskDetails row={row} disabled={isReadonly} />,
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
      title="6. Zadania do zrealizowania w trakcie rejsu"
      expandedByDefault
      data-testid="form-a-research-tasks-section"
    >
      <div>
        <form.AppField
          name="researchTasks"
          mode="array"
          children={(field) => (
            <>
              <AppTable
                columns={getColumns((index) => {
                  field.removeValue(index);
                  field.handleBlur();
                })}
                data={field.state.value}
                showRequiredAsterisk
                buttons={() => [
                  <DropdownElementSelectorButton
                    key="new"
                    options={taskTypes.map((type) => ({
                      value: getTaskName(type),
                      onClick: () => {
                        field.pushValue(getEmptyTask(type));
                        field.handleBlur();
                      },
                    }))}
                    variant="primary"
                    disabled={isReadonly}
                    data-testid="form-a-add-research-task-btn"
                  >
                    Dodaj nowe efekty rejsu
                  </DropdownElementSelectorButton>,
                  <DropdownElementSelectorButton
                    key="historical"
                    options={groupBy(initValues.historicalResearchTasks, (x) => x.type).flatMap(([type, tasks]) => [
                      ...[
                        {
                          value: type,
                          content: (
                            <div className="my-2 w-full rounded-lg px-2 text-center text-sm text-gray-500">
                              {getTaskName(type as ResearchTaskType)}
                            </div>
                          ),
                        },
                      ],
                      ...tasks.map((task) => ({
                        value: JSON.stringify(task),
                        content: <ResearchTaskThumbnail task={task} />,
                        onClick: () => {
                          field.pushValue(task);
                          field.handleBlur();
                        },
                      })),
                    ])}
                    variant="primaryOutline"
                    disabled={isReadonly}
                    data-testid="form-a-add-historical-research-task-btn"
                  >
                    Dodaj historyczne efekty rejsu
                  </DropdownElementSelectorButton>,
                ]}
                emptyTableMessage="Nie dodano żadnego zadania."
                variant="form"
                disabled={isReadonly}
                errors={getErrors(field.state.meta, form.state.submissionAttempts)}
                data-testid="form-a-research-tasks-table"
              />
              <AppInputErrorsList
                errors={getErrors(field.state.meta, form.state.submissionAttempts)}
                data-testid="form-a-research-tasks-errors"
              />
            </>
          )}
        />
      </div>
    </AppAccordion>
  );
}
