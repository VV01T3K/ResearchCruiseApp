import { ReactFormExtendedApi } from '@tanstack/react-form';
import { Row } from '@tanstack/react-table';

import { AppInput } from '@/core/components/inputs/AppInput';
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { AppDatePickerInput } from '@/core/components/inputs/dates/AppDatePickerInput';
import { getErrors } from '@/core/lib/utils';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { OwnResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  form: ReactFormExtendedApi<FormADto, undefined>;
  row: Row<OwnResearchTaskDto>;
  disabled?: boolean;
  hasFormBeenSubmitted?: boolean;
};
export function OwnResearchTaskDetails({ form, row, disabled, hasFormBeenSubmitted }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <form.Field
        name={`researchTasks[${row.index}].title`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value as string}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            label="Roboczy tytuł projektu"
            placeholder="Wprowadź tytuł"
            required
            disabled={disabled}
          />
        )}
      />

      <form.Field
        name={`researchTasks[${row.index}].date`}
        children={(field) => (
          <AppDatePickerInput
            name={field.name}
            value={field.state.value as string}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            label="Przewidywany termin składania"
            required
            disabled={disabled}
          />
        )}
      />

      <form.Field
        name={`researchTasks[${row.index}].magazine`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value as string}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            label="Czasopismo"
            placeholder="Wprowadź czasopismo"
            required
            disabled={disabled}
          />
        )}
      />

      <form.Field
        name={`researchTasks[${row.index}].ministerialPoints`}
        children={(field) => (
          <AppNumberInput
            name={field.name}
            value={parseInt(field.state.value as string)}
            minimum={0}
            step={10}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            label="Przewidywane punkty ministerialne"
            required
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
