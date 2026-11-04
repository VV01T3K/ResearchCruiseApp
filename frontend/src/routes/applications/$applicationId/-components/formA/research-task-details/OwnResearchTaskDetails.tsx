import { Row } from '@/integrations/tanstack/table/features';

import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { formADefaultValues } from '@/features/applications/schemas/formA.schema';
import { OwnResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

type Props = {
  row: Row<OwnResearchTaskValues>;
  disabled?: boolean;
};
export function OwnResearchTaskDetails({ row, disabled }: Props) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <form.AppField name={`researchTasks[${row.index}].title`}>
        {(field) => (
          <field.TextField
            aria-label={`Roboczy tytuł projektu, wiersz ${row.index + 1}`}
            label="Roboczy tytuł projektu"
            placeholder="Wprowadź tytuł"
            disabled={disabled}
          />
        )}
      </form.AppField>

      <form.AppField name={`researchTasks[${row.index}].date`}>
        {(field) => <field.DateField label="Przewidywany termin składania" disabled={disabled} />}
      </form.AppField>

      <form.AppField name={`researchTasks[${row.index}].magazine`}>
        {(field) => (
          <field.TextField
            aria-label={`Czasopismo, wiersz ${row.index + 1}`}
            label="Czasopismo"
            placeholder="Wprowadź czasopismo"
            disabled={disabled}
          />
        )}
      </form.AppField>

      <form.AppField name={`researchTasks[${row.index}].ministerialPoints`}>
        {(field) => (
          <field.NullableNumberField
            aria-label={`Przewidywane punkty ministerialne, wiersz ${row.index + 1}`}
            minimum={0}
            step={10}
            label="Przewidywane punkty ministerialne"
            disabled={disabled}
          />
        )}
      </form.AppField>
    </div>
  );
}
