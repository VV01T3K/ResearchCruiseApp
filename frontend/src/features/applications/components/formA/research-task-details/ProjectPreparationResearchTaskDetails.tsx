import { Row } from '@/integrations/tanstack/table/features';

import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { formADefaultValues } from '@/features/applications/schemas/formA.schema';
import { ProjectPreparationResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

type Props = {
  row: Row<ProjectPreparationResearchTaskValues>;
  disabled?: boolean;
};
export function ProjectPreparationResearchTaskDetails({ row, disabled }: Props) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <form.AppField name={`researchTasks[${row.index}].title`}>
        {(field) => (
          <field.TextField
            aria-label={`Roboczy tytuł projektu, wiersz ${row.index + 1}`}
            label="Roboczy tytuł projektu"
            placeholder="Wprowadź tytuł"
            containerClassName="lg:col-span-2"
            disabled={disabled}
          />
        )}
      </form.AppField>

      <form.AppField name={`researchTasks[${row.index}].date`}>
        {(field) => <field.DateField label="Przewidywany termin składania" disabled={disabled} />}
      </form.AppField>

      <form.AppField name={`researchTasks[${row.index}].financingApproved`}>
        {(field) => (
          <field.SelectField
            value={String(field.state.value)}
            onChange={(value) => field.handleChange(value === 'true')}
            aria-label={`Otrzymano decyzję o finansowaniu? Wiersz ${row.index + 1}`}
            allOptions={[
              { value: 'true', inlineLabel: 'Tak' },
              { value: 'false', inlineLabel: 'Nie' },
            ]}
            label="Otrzymano decyzję o finansowaniu?"
            disabled={disabled}
          />
        )}
      </form.AppField>
    </div>
  );
}
