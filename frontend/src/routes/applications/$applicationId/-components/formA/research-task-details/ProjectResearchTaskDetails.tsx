import { Row } from '@tanstack/react-table';

import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppNumberInput } from '@/components/shared/inputs/AppNumberInput';
import { AppMonthPickerInput } from '@/components/shared/inputs/dates/AppMonthPickerInput';
import { AnyReactFormApi } from '@/lib/form';
import { getErrors } from '@/lib/utils';
import { FormAValues } from '@/routes/applications/$applicationId/-schemas/types/FormAValues';
import { ProjectResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  form: AnyReactFormApi<FormAValues>;
  row: Row<ProjectResearchTaskValues>;
  disabled?: boolean;
  hasFormBeenSubmitted?: boolean;
};
export function ProjectResearchTaskDetails({ form, row, disabled, hasFormBeenSubmitted }: Props) {
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
            label="Tytuł"
            placeholder="Wprowadź tytuł"
            containerClassName="lg:col-span-2"
            disabled={disabled}
          />
        )}
      />

      <form.Field
        name={`researchTasks[${row.index}].startDate`}
        children={(field) => (
          <AppMonthPickerInput
            name={field.name}
            value={field.state.value as string}
            onBlur={field.handleBlur}
            onChange={(value) => field.handleChange(value ?? '')}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            label="Data rozpoczęcia"
            disabled={disabled}
          />
        )}
      />

      <form.Field
        name={`researchTasks[${row.index}].endDate`}
        children={(field) => (
          <AppMonthPickerInput
            name={field.name}
            value={field.state.value as string}
            onBlur={field.handleBlur}
            onChange={(value) => field.handleChange(value ?? '')}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            label="Data zakończenia"
            disabled={disabled}
          />
        )}
      />

      <form.Field
        name={`researchTasks[${row.index}].financingAmount`}
        children={(field) => (
          <AppNumberInput
            name={field.name}
            value={field.state.value as number}
            type="float"
            minimum={0}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            label="Kwota finansowania [zł]"
            disabled={disabled}
          />
        )}
      />

      <form.Field
        name={`researchTasks[${row.index}].securedAmount`}
        children={(field) => (
          <AppNumberInput
            name={field.name}
            value={field.state.value as number}
            type="float"
            minimum={0}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            label="Środki zabezpieczone na realizację rejsu [zł]"
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
