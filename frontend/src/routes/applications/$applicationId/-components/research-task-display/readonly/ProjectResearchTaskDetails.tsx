import { Input } from '@/components/shared/inputs/Input';
import { NumberInput } from '@/components/shared/inputs/NumberInput';
import { MonthPickerInput } from '@/components/shared/inputs/dates/MonthPickerInput';
import { useUnreadableErrors } from '@/integrations/tanstack/form/unreadableValues';
import type { ProjectResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  data: ProjectResearchTaskValues;
};
export function ProjectResearchTaskDetails({ data }: Props) {
  const financingErrors = useUnreadableErrors('researchTasks[].financingAmount', data.financingAmount, true);
  const securedErrors = useUnreadableErrors('researchTasks[].securedAmount', data.securedAmount, true);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Input
        name="researchTasks[].title"
        value={data.title}
        label="Tytuł"
        placeholder="Wprowadź tytuł"
        containerClassName="lg:col-span-2"
        disabled={true}
      />

      <MonthPickerInput
        name="researchTasks[].startDate"
        value={data.startDate}
        label="Data rozpoczęcia"
        disabled={true}
      />

      <MonthPickerInput name="researchTasks[].endDate" value={data.endDate} label="Data zakończenia" disabled={true} />

      <NumberInput
        nullable
        name="researchTasks[].financingAmount"
        value={data.financingAmount}
        errors={financingErrors}
        type="float"
        minimum={0}
        label="Kwota finansowania [zł]"
        disabled={true}
      />

      <NumberInput
        nullable
        name="researchTasks[].securedAmount"
        value={data.securedAmount}
        errors={securedErrors}
        type="float"
        minimum={0}
        label="Środki zabezpieczone na realizację rejsu [zł]"
        disabled={true}
      />
    </div>
  );
}
