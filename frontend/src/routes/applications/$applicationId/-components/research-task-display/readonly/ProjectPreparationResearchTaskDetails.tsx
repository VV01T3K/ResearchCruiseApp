import { DropdownInput } from '@/components/shared/inputs/DropdownInput';
import { Input } from '@/components/shared/inputs/Input';
import { DatePickerInput } from '@/components/shared/inputs/dates/DatePickerInput';
import { useUnreadableErrors } from '@/integrations/tanstack/form/unreadableValues';
import type { ProjectPreparationResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  data: ProjectPreparationResearchTaskValues;
};
export function ProjectPreparationResearchTaskDetails({ data }: Props) {
  const approvedErrors = useUnreadableErrors('researchTasks[].financingApproved', data.financingApproved, true);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Input
        name="researchTasks[].title"
        value={data.title}
        label="Roboczy tytuł projektu"
        placeholder="Wprowadź tytuł"
        containerClassName="lg:col-span-2"
        disabled={true}
      />

      <DatePickerInput
        name="researchTasks[].date"
        value={data.date}
        label="Przewidywany termin składania"
        disabled={true}
      />

      <DropdownInput
        name="researchTasks[].financingApproved"
        value={String(data.financingApproved)}
        errors={approvedErrors}
        allOptions={[
          { value: 'true', inlineLabel: 'Tak' },
          { value: 'false', inlineLabel: 'Nie' },
        ]}
        label="Otrzymano decyzję o finansowaniu?"
        disabled={true}
      />
    </div>
  );
}
