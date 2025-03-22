import { AppInput } from '@/core/components/inputs/AppInput';
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { AppMonthPickerInput } from '@/core/components/inputs/dates/AppMonthPickerInput';
import { ProjectResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  data: ProjectResearchTaskDto;
};
export function ReadOnlyProjectResearchTaskDetails({ data }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AppInput
        name="researchTasks[].title"
        value={data.title}
        label="Tytuł"
        placeholder="Wprowadź tytuł"
        containerClassName="lg:col-span-2"
        required
        disabled={true}
      />

      <AppMonthPickerInput
        name="researchTasks[].startDate"
        value={data.startDate}
        label="Data rozpoczęcia"
        required
        disabled={true}
      />

      <AppMonthPickerInput
        name="researchTasks[].endDate"
        value={data.endDate}
        label="Data zakończenia"
        required
        disabled={true}
      />

      <AppNumberInput
        name="researchTasks[].financingAmount"
        value={parseFloat(data.financingAmount)}
        type="float"
        minimum={0}
        label="Kwota finansowania [zł]"
        required
        disabled={true}
      />

      <AppNumberInput
        name="researchTasks[].securedAmount"
        value={parseFloat(data.securedAmount)}
        type="float"
        minimum={0}
        label="Środki zabezpieczone na realizację rejsu [zł]"
        required
        disabled={true}
      />
    </div>
  );
}
