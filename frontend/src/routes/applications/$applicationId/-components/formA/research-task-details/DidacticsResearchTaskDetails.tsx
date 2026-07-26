import { Row } from '@tanstack/react-table';

import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { DidacticsResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  row: Row<DidacticsResearchTaskValues>;
  disabled?: boolean;
};
export function DidacticsResearchTaskDetails({ row, disabled }: Props) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  return (
    <div>
      <form.AppField
        name={`researchTasks[${row.index}].description`}
        children={(field) => (
          <field.TextField
            label="Opis zajęcia dydaktycznego"
            placeholder="Wprowadź opis zajęcia dydaktycznego"
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
