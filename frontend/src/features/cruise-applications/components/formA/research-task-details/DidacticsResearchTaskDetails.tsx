import { Row } from '@tanstack/react-table';

import { AppInput } from '@/components/inputs/AppInput';
import { AnyReactFormApi } from '@/lib/form';
import { getErrors } from '@/lib/utils';
import { FormADto } from '@/features/cruise-applications/models/FormADto';
import { DidacticsResearchTaskDto } from '@/features/cruise-applications/models/ResearchTaskDto';

type Props = {
  form: AnyReactFormApi<FormADto>;
  row: Row<DidacticsResearchTaskDto>;
  disabled?: boolean;
  hasFormBeenSubmitted?: boolean;
};
export function DidacticsResearchTaskDetails({ form, row, disabled, hasFormBeenSubmitted }: Props) {
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
            label="Opis zajęcia dydaktycznego"
            placeholder="Wprowadź opis zajęcia dydaktycznego"
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
