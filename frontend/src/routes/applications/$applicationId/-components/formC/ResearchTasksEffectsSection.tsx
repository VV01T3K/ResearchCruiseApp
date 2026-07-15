import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppTable } from '@/components/shared/table/AppTable';
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
    const { isReadonly } = context;

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
                  <form.AppField
                    name={`researchTasksEffects[${row.index}].done`}
                    children={(field) => (
                      <field.CheckboxField size="md" label="Zrealizowane" labelPosition="top" disabled={isReadonly} />
                    )}
                  />
                  <form.AppField
                    name={`researchTasksEffects[${row.index}].managerConditionMet`}
                    children={(field) => {
                      if (field.state.value && !taskDone) {
                        field.handleChange(false);
                      }
                      return (
                        <field.CheckboxField
                          size="md"
                          label="Czy naliczyć punkty kierownikowi?"
                          labelPosition="top"
                          disabled={isReadonly || !taskDone}
                        />
                      );
                    }}
                  />
                  <form.AppField
                    name={`researchTasksEffects[${row.index}].deputyConditionMet`}
                    children={(field) => {
                      if (field.state.value && !taskDone) {
                        field.handleChange(false);
                      }
                      return (
                        <field.CheckboxField
                          size="md"
                          label="Czy naliczyć punkty zastępcy?"
                          labelPosition="top"
                          disabled={isReadonly || !taskDone}
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
