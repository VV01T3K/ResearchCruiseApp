import { Row } from '@tanstack/react-table';

import { AppInput } from '@/components/shared/inputs/AppInput';
import { useTypedAppFormContext } from '@/lib/form';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { getErrors } from '@/lib/form-errors';
import { ThesisResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  row: Row<ThesisResearchTaskValues>;
  disabled?: boolean;
};
export function ThesisResearchTaskDetails({ row, disabled }: Props) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <form.Field
        name={`researchTasks[${row.index}].author`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value as string}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta)}
            label="Autor"
            placeholder="Wprowadź autora"
            disabled={disabled}
          />
        )}
      />

      <form.Field
        name={`researchTasks[${row.index}].title`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value as string}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta)}
            label="Tytuł"
            placeholder="Wprowadź tytuł"
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
