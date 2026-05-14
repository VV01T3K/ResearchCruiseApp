import { Row } from '@tanstack/react-table';

import { AppDropdownInput } from '@/components/shared/inputs/AppDropdownInput';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppDatePickerInput } from '@/components/shared/inputs/dates/AppDatePickerInput';
import { AnyReactFormApi } from '@/lib/form';
import { getErrors } from '@/lib/utils';
import { FormADto } from '@/api/dto/applications/FormADto';
import { ProjectPreparationResearchTaskDto } from '@/api/dto/applications/ResearchTaskDto';

type Props = {
  form: AnyReactFormApi<FormADto>;
  row: Row<ProjectPreparationResearchTaskDto>;
  disabled?: boolean;
  hasFormBeenSubmitted?: boolean;
};
export function ProjectPreparationResearchTaskDetails({ form, row, disabled, hasFormBeenSubmitted }: Props) {
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
            containerClassName="lg:col-span-2"
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
            label="Przewidywany termin składania"
            disabled={disabled}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
          />
        )}
      />

      <form.Field
        name={`researchTasks[${row.index}].financingApproved`}
        children={(field) => (
          <AppDropdownInput
            name={field.name}
            value={field.state.value as string}
            onBlur={field.handleBlur}
            onChange={(value) => (field.handleChange as (value: string) => void)(value)}
            allOptions={[
              { value: 'true', inlineLabel: 'Tak' },
              { value: 'false', inlineLabel: 'Nie' },
            ]}
            label="Otrzymano decyzję o finansowaniu?"
            disabled={disabled}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
          />
        )}
      />
    </div>
  );
}
