import { Row } from '@tanstack/react-table';

import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { ThesisResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  row: Row<ThesisResearchTaskValues>;
  disabled?: boolean;
};
export function ThesisResearchTaskDetails({ row, disabled }: Props) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <form.AppField
        name={`researchTasks[${row.index}].author`}
        children={(field) => <field.TextField label="Autor" placeholder="Wprowadź autora" disabled={disabled} />}
      />

      <form.AppField
        name={`researchTasks[${row.index}].title`}
        children={(field) => <field.TextField label="Tytuł" placeholder="Wprowadź tytuł" disabled={disabled} />}
      />
    </div>
  );
}
