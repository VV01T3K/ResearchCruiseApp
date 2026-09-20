import { Row } from '@/components/shared/table/common/tableFeatures';

import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { OtherResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  row: Row<OtherResearchTaskValues>;
  disabled?: boolean;
};
export function OtherResearchTaskDetails({ row, disabled }: Props) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  return (
    <div>
      <form.AppField
        name={`researchTasks[${row.index}].description`}
        children={(field) => (
          <field.TextField label="Opis zadania" placeholder="Wprowadź opis zadania" disabled={disabled} />
        )}
      />
    </div>
  );
}
