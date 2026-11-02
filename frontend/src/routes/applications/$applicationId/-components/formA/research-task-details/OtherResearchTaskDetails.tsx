import { Row } from '@/integrations/tanstack/table/features';

import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { formADefaultValues } from '@/features/applications/schemas/formA.schema';
import { OtherResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

type Props = {
  row: Row<OtherResearchTaskValues>;
  disabled?: boolean;
};
export function OtherResearchTaskDetails({ row, disabled }: Props) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  return (
    <div>
      <form.AppField name={`researchTasks[${row.index}].description`}>
        {(field) => <field.TextField label="Opis zadania" placeholder="Wprowadź opis zadania" disabled={disabled} />}
      </form.AppField>
    </div>
  );
}
