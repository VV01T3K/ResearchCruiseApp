import { Row } from '@tanstack/react-table';

import { AppInput } from '@/components/shared/inputs/AppInput';
import { useTypedAppFormContext } from '@/lib/form';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { getErrors } from '@/lib/form-errors';
import { OtherResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  row: Row<OtherResearchTaskValues>;
  disabled?: boolean;
};
export function OtherResearchTaskDetails({ row, disabled }: Props) {
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
            label="Opis zadania"
            placeholder="Wprowadź opis zadania"
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
