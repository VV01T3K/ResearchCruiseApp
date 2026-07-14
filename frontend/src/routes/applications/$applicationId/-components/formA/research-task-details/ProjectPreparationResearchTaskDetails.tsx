import { Row } from '@tanstack/react-table';

import { AppDropdownInput } from '@/components/shared/inputs/AppDropdownInput';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppDatePickerInput } from '@/components/shared/inputs/dates/AppDatePickerInput';
import { useTypedAppFormContext } from '@/lib/form';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { getErrors } from '@/lib/form-errors';
import { ProjectPreparationResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  row: Row<ProjectPreparationResearchTaskValues>;
  disabled?: boolean;
};
export function ProjectPreparationResearchTaskDetails({ row, disabled }: Props) {
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
            errors={getErrors(field.state.meta)}
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
            errors={getErrors(field.state.meta)}
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
            errors={getErrors(field.state.meta)}
          />
        )}
      />
    </div>
  );
}
