import { ColumnDef } from '@tanstack/react-table';
import { useSelector } from '@tanstack/react-form';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppTable } from '@/components/shared/table/AppTable';
import { ResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/ResearchTaskDetails';
import { useTypedAppFormContext } from '@/lib/form';
import type { FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';
import { getTaskName } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';
import { ResearchTaskEffectValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskEffectValues';

export function ResearchTasksEffectsSection({ context }: { context: FormCViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formCDefaultValues });
  const { isReadonly } = context;
  const researchTasksEffects = useSelector(form.store, (state) => state.values.researchTasksEffects);

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
                  listeners={{
                    onChange: ({ value }) => {
                      if (value) return;
                      form.setFieldValue(`researchTasksEffects[${row.index}].managerConditionMet`, false);
                      form.setFieldValue(`researchTasksEffects[${row.index}].deputyConditionMet`, false);
                    },
                  }}
                  children={(field) => (
                    <field.CheckboxField size="md" label="Zrealizowane" labelPosition="top" disabled={isReadonly} />
                  )}
                />
                <form.AppField
                  name={`researchTasksEffects[${row.index}].managerConditionMet`}
                  children={(field) => (
                    <field.CheckboxField
                      size="md"
                      label="Czy naliczyć punkty kierownikowi?"
                      labelPosition="top"
                      disabled={isReadonly || !taskDone}
                    />
                  )}
                />
                <form.AppField
                  name={`researchTasksEffects[${row.index}].deputyConditionMet`}
                  children={(field) => (
                    <field.CheckboxField
                      size="md"
                      label="Czy naliczyć punkty zastępcy?"
                      labelPosition="top"
                      disabled={isReadonly || !taskDone}
                    />
                  )}
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
        data={researchTasksEffects}
        columns={columns}
        buttons={() => []}
        emptyTableMessage="Nie dodano żadnego zadania."
        showRequiredAsterisk
        disabled={isReadonly}
      />
    </AppAccordion>
  );
}
