import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppCheckbox } from '@/components/shared/inputs/AppCheckbox';
import { AppTable } from '@/components/shared/table/AppTable';
import { getErrors } from '@/lib/utils';
import { ResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/ResearchTaskDetails';
import { withForm } from '@/lib/form';
import type { FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';
import { getTaskName } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';
import { ResearchTaskEffectValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskEffectValues';

export const ResearchTasksEffectsSection = withForm({
  defaultValues: formCDefaultValues,
  props: {} as { context: FormCViewModel },
  render: function ResearchTasksEffectsSection({ form, context }) {
    const { isReadonly, hasFormBeenSubmitted } = context;

    const columns: ColumnDef<ResearchTaskEffectValues>[] = [
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
        cell: ({ row }) => <ResearchTaskDetails data={row.original} />,
        size: 45,
      },
      {
        id: 'done-and-conditions',
        cell: ({ row }) => {
          return (
            <form.Subscribe
              selector={(state) => state.values.researchTasksEffects[row.index].done}
              children={(taskDone) => (
                <div className="flex items-center justify-center gap-4">
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
      <AppAccordion
        title="7. Zadania przypisane do rejsu - efekty rejsu"
        expandedByDefault
        data-testid="form-c-research-tasks-effects-section"
      >
        <AppTable
          data={form.state.values.researchTasksEffects}
          columns={columns}
          buttons={() => []}
          emptyTableMessage="Nie dodano żadnego zadania."
          showRequiredAsterisk
          disabled={isReadonly}
        />
      </AppAccordion>
    );
  },
});
