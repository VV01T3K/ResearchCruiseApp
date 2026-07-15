import { Row } from '@tanstack/react-table';

import { useTypedAppFormContext } from '@/lib/form';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { ProjectPreparationResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  row: Row<ProjectPreparationResearchTaskValues>;
  disabled?: boolean;
};
export function ProjectPreparationResearchTaskDetails({ row, disabled }: Props) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <form.AppField
        name={`researchTasks[${row.index}].title`}
        children={(field) => (
          <field.TextField
            label="Roboczy tytuł projektu"
            placeholder="Wprowadź tytuł"
            containerClassName="lg:col-span-2"
            disabled={disabled}
          />
        )}
      />

      <form.AppField
        name={`researchTasks[${row.index}].date`}
        children={(field) => <field.DateField label="Przewidywany termin składania" disabled={disabled} />}
      />

      <form.AppField
        name={`researchTasks[${row.index}].financingApproved`}
        children={(field) => (
          <field.BooleanSelectField
            allOptions={[
              { value: 'true', inlineLabel: 'Tak' },
              { value: 'false', inlineLabel: 'Nie' },
            ]}
            label="Otrzymano decyzję o finansowaniu?"
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
