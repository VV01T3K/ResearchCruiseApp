import { Row } from '@tanstack/react-table';

import { AppInput } from '@/components/shared/inputs/AppInput';
import { useTypedAppFormContext } from '@/lib/form';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { getErrors } from '@/lib/form-errors';
import { DidacticsResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  row: Row<DidacticsResearchTaskValues>;
  disabled?: boolean;
};
export function DidacticsResearchTaskDetails({ row, disabled }: Props) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  return (
    <div>
      <form.Field
        name={`researchTasks[${row.index}].description`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value as string}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta)}
            label="Opis zajęcia dydaktycznego"
            placeholder="Wprowadź opis zajęcia dydaktycznego"
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
