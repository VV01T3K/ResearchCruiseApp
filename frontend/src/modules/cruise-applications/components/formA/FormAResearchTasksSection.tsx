import { FieldApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { getErrors, groupBy } from '@/core/lib/utils';
import { CruiseApplicationDropdownElementSelectorButton } from '@/cruise-applications/components/common/CruiseApplicationDropdownElementSelectorButton';
import { ResearchTaskThumbnail } from '@/cruise-applications/components/common/research-task-thumbnails/ResearchTaskThumbnail';
import { ResearchTaskDetails } from '@/cruise-applications/components/formA/research-task-details/ResearchTaskDetails';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';
import { FormADto } from '@/cruise-applications/models/FormADto';
import {
  getEmptyTask,
  getTaskName,
  ResearchTaskDto,
  ResearchTaskType,
  taskTypes,
} from '@/cruise-applications/models/ResearchTaskDto';

export function FormAResearchTasksSection() {
  const { form, isReadonly, initValues, hasFormBeenSubmitted } = useFormA();

  function getColumns(
    field: FieldApi<FormADto, 'researchTasks', undefined, undefined, ResearchTaskDto[]>
  ): ColumnDef<ResearchTaskDto>[] {
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
          <form.Field
            key={row.index}
            name={`researchTasks[${row.index}].type`}
            children={(field) => getTaskName(field.state.value) ?? 'Nieznany typ'}
          />
        ),
        size: 20,
      },
      {
        header: 'Szczegóły',
        cell: ({ row }) => (
          <ResearchTaskDetails
            form={form}
            row={row}
            disabled={isReadonly}
            hasFormBeenSubmitted={hasFormBeenSubmitted}
          />
        ),
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
    <AppAccordion title="6. Zadania do zrealizowania w trakcie rejsu" expandedByDefault>
      <div>
        <form.Field
          name="researchTasks"
          mode="array"
          children={(field) => (
            <>
              <AppTable
                columns={getColumns(field)}
                data={field.state.value}
                buttons={() => [
                  <CruiseApplicationDropdownElementSelectorButton
                    key="new"
                    options={taskTypes.map((type) => ({
                      value: getTaskName(type),
                      onClick: () => {
                        field.pushValue(getEmptyTask(type));
                        field.handleChange((prev) => prev);
                        field.handleBlur();
                      },
                    }))}
                    variant="primary"
                    disabled={isReadonly}
                  >
                    Dodaj nowe zadanie
                  </CruiseApplicationDropdownElementSelectorButton>,
                  <CruiseApplicationDropdownElementSelectorButton
                    key="historical"
                    options={groupBy(initValues.historicalResearchTasks, (x) => x.type).flatMap(([type, tasks]) => [
                      ...[
                        {
                          value: type,
                          content: (
                            <div className="w-full rounded-lg text-center text-gray-500 text-sm px-2 my-2">
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
                          field.handleChange((prev) => prev);
                          field.handleBlur();
                        },
                      })),
                    ])}
                    variant="primaryOutline"
                    disabled={isReadonly}
                  >
                    Dodaj historyczne zadanie
                  </CruiseApplicationDropdownElementSelectorButton>,
                ]}
                emptyTableMessage="Nie dodano żadnego zadania."
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
