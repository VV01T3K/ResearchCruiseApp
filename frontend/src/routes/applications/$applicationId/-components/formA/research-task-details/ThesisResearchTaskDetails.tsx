import { Row } from '@/integrations/tanstack/table/features';

import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { formADefaultValues } from '@/features/applications/schemas/formA.schema';
import { ThesisResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

type Props = {
  row: Row<ThesisResearchTaskValues>;
  disabled?: boolean;
};
export function ThesisResearchTaskDetails({ row, disabled }: Props) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <form.AppField name={`researchTasks[${row.index}].author`}>
        {(field) => (
          <field.TextField
            aria-label={`Autor, wiersz ${row.index + 1}`}
            label="Autor"
            placeholder="Wprowadź autora"
            disabled={disabled}
          />
        )}
      </form.AppField>

      <form.AppField name={`researchTasks[${row.index}].title`}>
        {(field) => (
          <field.TextField
            aria-label={`Tytuł, wiersz ${row.index + 1}`}
            label="Tytuł"
            placeholder="Wprowadź tytuł"
            disabled={disabled}
          />
        )}
      </form.AppField>
    </div>
  );
}
