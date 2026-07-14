import { Row } from '@tanstack/react-table';

import { AppInput } from '@/components/shared/inputs/AppInput';
import type { FormAFormApi } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { getErrors } from '@/lib/utils';
import { OtherResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  form: FormAFormApi;
  row: Row<OtherResearchTaskValues>;
  disabled?: boolean;
  hasFormBeenSubmitted?: boolean;
};
export function OtherResearchTaskDetails({ form, row, disabled, hasFormBeenSubmitted }: Props) {
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
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            label="Opis zadania"
            placeholder="Wprowadź opis zadania"
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
