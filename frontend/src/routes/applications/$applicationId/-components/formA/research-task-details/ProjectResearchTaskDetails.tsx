import { Row } from '@/integrations/tanstack/table/features';

import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { ProjectResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  row: Row<ProjectResearchTaskValues>;
  disabled?: boolean;
};
export function ProjectResearchTaskDetails({ row, disabled }: Props) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <form.AppField name={`researchTasks[${row.index}].title`}>
        {(field) => (
          <field.TextField
            label="Tytuł"
            placeholder="Wprowadź tytuł"
            containerClassName="lg:col-span-2"
            disabled={disabled}
          />
        )}
      </form.AppField>

      <form.AppField name={`researchTasks[${row.index}].startDate`}>
        {(field) => <field.MonthField label="Data rozpoczęcia" disabled={disabled} />}
      </form.AppField>

      <form.AppField name={`researchTasks[${row.index}].endDate`}>
        {(field) => <field.MonthField label="Data zakończenia" disabled={disabled} />}
      </form.AppField>

      <form.AppField name={`researchTasks[${row.index}].financingAmount`}>
        {(field) => (
          <field.NullableNumberField type="float" minimum={0} label="Kwota finansowania [zł]" disabled={disabled} />
        )}
      </form.AppField>

      <form.AppField name={`researchTasks[${row.index}].securedAmount`}>
        {(field) => (
          <field.NullableNumberField
            type="float"
            minimum={0}
            label="Środki zabezpieczone na realizację rejsu [zł]"
            disabled={disabled}
          />
        )}
      </form.AppField>
    </div>
  );
}
