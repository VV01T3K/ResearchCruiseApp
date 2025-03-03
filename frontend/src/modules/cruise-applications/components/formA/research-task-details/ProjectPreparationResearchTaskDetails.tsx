import { ReactFormExtendedApi } from '@tanstack/react-form';
import { Row } from '@tanstack/react-table';

import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppDatePickerInput } from '@/core/components/inputs/dates/AppDatePickerInput';
import { getErrors } from '@/core/lib/utils';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { ProjectPreparationResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  form: ReactFormExtendedApi<FormADto, undefined>;
  row: Row<ProjectPreparationResearchTaskDto>;
  disabled?: boolean;
  hasFormBeenSubmitted?: boolean;
};
export function ProjectPreparationResearchTaskDetails({ form, row, disabled, hasFormBeenSubmitted }: Props) {
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
            containerClassName="lg:col-span-2"
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
            label="Przewidywany termin składania"
            required
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
            onChange={field.handleChange}
            allOptions={[
              { value: 'true', inlineLabel: 'Tak' },
              { value: 'false', inlineLabel: 'Nie' },
            ]}
            label="Otrzymano decyzję o finansowaniu?"
            required
            disabled={disabled}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
          />
        )}
      />
    </div>
  );
}
