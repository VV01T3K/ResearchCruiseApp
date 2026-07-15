import { Row } from '@tanstack/react-table';

import { useTypedAppFormContext } from '@/lib/form';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { OwnResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  row: Row<OwnResearchTaskValues>;
  disabled?: boolean;
};
export function OwnResearchTaskDetails({ row, disabled }: Props) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <form.AppField
        name={`researchTasks[${row.index}].title`}
        children={(field) => (
          <field.TextField label="Roboczy tytuł projektu" placeholder="Wprowadź tytuł" disabled={disabled} />
        )}
      />

      <form.AppField
        name={`researchTasks[${row.index}].date`}
        children={(field) => <field.DateField label="Przewidywany termin składania" disabled={disabled} />}
      />

      <form.AppField
        name={`researchTasks[${row.index}].magazine`}
        children={(field) => (
          <field.TextField label="Czasopismo" placeholder="Wprowadź czasopismo" disabled={disabled} />
        )}
      />

      <form.AppField
        name={`researchTasks[${row.index}].ministerialPoints`}
        children={(field) => (
          <field.NumberField minimum={0} step={10} label="Przewidywane punkty ministerialne" disabled={disabled} />
        )}
      />
    </div>
  );
}
