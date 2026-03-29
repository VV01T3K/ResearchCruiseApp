import { Row } from '@tanstack/react-table';

import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppNumberInput } from '@/components/shared/inputs/AppNumberInput';
import { AppDatePickerInput } from '@/components/shared/inputs/dates/AppDatePickerInput';
import { AnyReactFormApi } from '@/lib/form';
import { getErrors } from '@/lib/utils';
import { FormADto } from '@/api/dto/applications/FormADto';
import { OwnResearchTaskDto } from '@/api/dto/applications/ResearchTaskDto';

type Props = {
  form: AnyReactFormApi<FormADto>;
  row: Row<OwnResearchTaskDto>;
  disabled?: boolean;
  hasFormBeenSubmitted?: boolean;
};
export function OwnResearchTaskDetails({ form, row, disabled, hasFormBeenSubmitted }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
            onChange={(value) => field.handleChange(value ?? '')}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            label="Przewidywany termin składania"
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
            onChange={(value) => field.handleChange(String(value))}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            label="Przewidywane punkty ministerialne"
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
