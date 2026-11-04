import { ColumnDef } from '@/integrations/tanstack/table/features';
import { useSelector } from '@tanstack/react-form';

import { Accordion } from '@/components/shared/Accordion';
import { Table } from '@/components/shared/table/Table';
import { ResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/ResearchTaskDetails';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormCViewModel } from '@/features/applications/models/formC-view-model';
import { formCDefaultValues } from '@/features/applications/schemas/formC.schema';
import { getTaskName } from '@/features/applications/schemas/types/ResearchTaskValues';
import { ResearchTaskEffectValues } from '@/features/applications/schemas/types/ResearchTaskEffectValues';

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
      header: () => <span className="sr-only">Realizacja</span>,
      cell: ({ row }) => {
        return (
          <form.Subscribe selector={(state) => state.values.researchTasksEffects[row.index].done}>
            {(taskDone) => (
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
                >
                  {(field) => (
                    <field.CheckboxField size="md" label="Zrealizowane" labelPosition="top" disabled={isReadonly} />
                  )}
                </form.AppField>
                <form.AppField name={`researchTasksEffects[${row.index}].managerConditionMet`}>
                  {(field) => (
                    <field.CheckboxField
                      size="md"
                      label="Czy naliczyć punkty kierownikowi?"
                      labelPosition="top"
                      disabled={isReadonly || taskDone !== true}
                    />
                  )}
                </form.AppField>
                <form.AppField name={`researchTasksEffects[${row.index}].deputyConditionMet`}>
                  {(field) => (
                    <field.CheckboxField
                      size="md"
                      label="Czy naliczyć punkty zastępcy?"
                      labelPosition="top"
                      disabled={isReadonly || taskDone !== true}
                    />
                  )}
                </form.AppField>
              </div>
            )}
          </form.Subscribe>
        );
      },
      size: 35,
    },
  ];

  return (
    <Accordion title="7. Zadania przypisane do rejsu - efekty rejsu" expandedByDefault>
      <Table
        data={researchTasksEffects}
        columns={columns}
        buttons={() => []}
        emptyTableMessage="Nie dodano żadnego zadania."
        showRequiredAsterisk
        disabled={isReadonly}
      />
    </Accordion>
  );
}
