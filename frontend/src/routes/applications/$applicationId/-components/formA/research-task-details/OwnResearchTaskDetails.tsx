import { Row } from '@tanstack/react-table';

import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppNumberInput } from '@/components/shared/inputs/AppNumberInput';
import { AppDatePickerInput } from '@/components/shared/inputs/dates/AppDatePickerInput';
import { useTypedAppFormContext } from '@/lib/form';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { getErrors } from '@/lib/form-errors';
import { OwnResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  row: Row<OwnResearchTaskValues>;
  disabled?: boolean;
  submissionAttempts?: number;
};
export function OwnResearchTaskDetails({ row, disabled, submissionAttempts }: Props) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
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
            errors={getErrors(field.state.meta, submissionAttempts)}
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
            errors={getErrors(field.state.meta, submissionAttempts)}
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
            errors={getErrors(field.state.meta, submissionAttempts)}
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
            value={field.state.value as number}
            minimum={0}
            step={10}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, submissionAttempts)}
            label="Przewidywane punkty ministerialne"
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
