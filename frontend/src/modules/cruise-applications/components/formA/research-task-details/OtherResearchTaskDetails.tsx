import { ReactFormExtendedApi } from '@tanstack/react-form';
import { Row } from '@tanstack/react-table';

import { AppInput } from '@/core/components/inputs/AppInput';
import { getErrors } from '@/core/lib/utils';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { OtherResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  form: ReactFormExtendedApi<FormADto, undefined>;
  row: Row<OtherResearchTaskDto>;
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
            required
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
