import { Row } from '@/integrations/tanstack/table/features';

import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { formADefaultValues } from '@/features/applications/schemas/formA.schema';
import { DidacticsResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

type Props = {
  row: Row<DidacticsResearchTaskValues>;
  disabled?: boolean;
};
export function DidacticsResearchTaskDetails({ row, disabled }: Props) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  return (
    <div>
      <form.AppField name={`researchTasks[${row.index}].description`}>
        {(field) => (
          <field.TextField
            aria-label={`Opis zajęcia dydaktycznego, wiersz ${row.index + 1}`}
            label="Opis zajęcia dydaktycznego"
            placeholder="Wprowadź opis zajęcia dydaktycznego"
            disabled={disabled}
          />
        )}
      </form.AppField>
    </div>
  );
}
