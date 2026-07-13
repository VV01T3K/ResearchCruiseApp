import { Row } from '@tanstack/react-table';

import { AppInput } from '@/components/shared/inputs/AppInput';
import { AnyReactFormApi } from '@/lib/form';
import { getErrors } from '@/lib/utils';
import { FormADto } from '@/api/applications/dto/FormADto';
import { OtherResearchTaskDto } from '@/api/applications/dto/ResearchTaskDto';

type Props = {
  form: AnyReactFormApi<FormADto>;
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
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
