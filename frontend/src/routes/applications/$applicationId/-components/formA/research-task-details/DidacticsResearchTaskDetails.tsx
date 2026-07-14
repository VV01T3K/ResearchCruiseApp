import { Row } from '@tanstack/react-table';

import { AppInput } from '@/components/shared/inputs/AppInput';
import type { FormAFormApi } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { getErrors } from '@/lib/utils';
import { DidacticsResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  form: FormAFormApi;
  row: Row<DidacticsResearchTaskValues>;
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
