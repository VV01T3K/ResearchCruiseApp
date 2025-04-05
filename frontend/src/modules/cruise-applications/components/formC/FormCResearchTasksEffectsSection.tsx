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
      header: 'Zrealizowane',
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
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
                  disabled={isReadonly}
                />
              )}
            />
          </div>
        );
      },
      size: 5,
    },
    {
      header: 'Naliczanie punktów',
      cell: ({ row }) => {
        return (
          <div className="grid grid-cols-2 gap-3">
            <form.Subscribe
              selector={(state) => state.values.researchTasksEffects[row.index].done}
              children={(taskDone) => (
                <>
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
                          disabled={isReadonly || taskDone === 'false'}
                        />
                      );
                    }}
                  />
                </>
              )}
            />
          </div>
        );
      },
      size: 30,
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
