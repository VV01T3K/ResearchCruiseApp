import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppCheckbox } from '@/core/components/inputs/AppCheckbox';
import { AppTable } from '@/core/components/table/AppTable';
import { getErrors } from '@/core/lib/utils';
import { ReadOnlyResearchTaskDetails } from '@/cruise-applications/components/common/readonly-research-task-details/ReadOnlyResearchTaskDetails';
import { useFormC } from '@/cruise-applications/contexts/FormCContext';
import { getTaskName } from '@/cruise-applications/models/ResearchTaskDto';
import { ResearchTaskEffectDto } from '@/cruise-applications/models/ResearchTaskEffectDto';

export function FormCResearchTasksSection() {
  const { form, isReadonly, hasFormBeenSubmitted } = useFormC();

  const columns: ColumnDef<ResearchTaskEffectDto>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 5,
    },
    {
      header: 'Zadanie',
      accessorFn: (row) => getTaskName(row.type) ?? 'Nieznany typ',
      size: 15,
    },
    {
      header: 'Szczegóły',
      cell: ({ row }) => <ReadOnlyResearchTaskDetails data={row.original} />,
      size: 45,
    },
    {
      id: 'done-and-conditions',
      cell: ({ row }) => {
        return (
          <form.Subscribe
            selector={(state) => state.values.researchTasksEffects[row.index].done}
            children={(taskDone) => (
              <div className="flex justify-center items-center gap-4">
                <form.Field
                  name={`researchTasksEffects[${row.index}].done`}
                  children={(field) => (
                    <AppCheckbox
                      size="md"
                      name={field.name}
                      checked={field.state.value === 'true'}
                      onChange={(value) => {
                        field.handleChange(value ? 'true' : 'false');
                      }}
                      onBlur={field.handleBlur}
                      errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                      label="Zrealizowane"
                      labelPosition="top"
                      disabled={isReadonly}
                    />
                  )}
                />
                <form.Field
                  name={`researchTasksEffects[${row.index}].managerConditionMet`}
                  children={(field) => {
                    if (field.state.value !== 'false' && taskDone === 'false') {
                      field.handleChange('false');
                    }
                    return (
                      <AppCheckbox
                        size="md"
                        name={field.name}
                        checked={field.state.value === 'true'}
                        onChange={(value) => field.handleChange(value ? 'true' : 'false')}
                        onBlur={field.handleBlur}
                        errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                        label="Czy naliczyć punkty kierownikowi?"
                        labelPosition="top"
                        disabled={isReadonly || taskDone === 'false'}
                      />
                    );
                  }}
                />
                <form.Field
                  name={`researchTasksEffects[${row.index}].deputyConditionMet`}
                  children={(field) => {
                    if (field.state.value !== 'false' && taskDone === 'false') {
                      field.handleChange('false');
                    }
                    return (
                      <AppCheckbox
                        size="md"
                        name={field.name}
                        checked={field.state.value === 'true'}
                        onChange={(value) => field.handleChange(value ? 'true' : 'false')}
                        onBlur={field.handleBlur}
                        errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                        label="Czy naliczyć punkty zastępcy?"
                        labelPosition="top"
                        disabled={isReadonly || taskDone === 'false'}
                      />
                    );
                  }}
                />
              </div>
            )}
          />
        );
      },
      size: 35,
    },
  ];

  return (
    <AppAccordion title="7. Zadania przypisane do rejsu - efekty rejsu" expandedByDefault>
      <AppTable
        data={form.state.values.researchTasksEffects}
        columns={columns}
        buttons={() => []}
        emptyTableMessage="Nie dodano żadnego zadania."
        disabled={isReadonly}
      />
    </AppAccordion>
  );
}
