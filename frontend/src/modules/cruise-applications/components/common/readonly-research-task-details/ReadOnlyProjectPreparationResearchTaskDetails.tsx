import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppDatePickerInput } from '@/core/components/inputs/dates/AppDatePickerInput';
import { ProjectPreparationResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  data: ProjectPreparationResearchTaskDto;
};
export function ReadOnlyProjectPreparationResearchTaskDetails({ data }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AppInput
        name="researchTasks[].title"
        value={data.title}
        label="Roboczy tytuł projektu"
        placeholder="Wprowadź tytuł"
        containerClassName="lg:col-span-2"
        required
        disabled={true}
      />

      <AppDatePickerInput
        name="researchTasks[].date"
        value={data.date}
        label="Przewidywany termin składania"
        required
        disabled={true}
      />

      <AppDropdownInput
        name="researchTasks[].financingApproved"
        value={data.financingApproved}
        allOptions={[
          { value: 'true', inlineLabel: 'Tak' },
          { value: 'false', inlineLabel: 'Nie' },
        ]}
        label="Otrzymano decyzję o finansowaniu?"
        required
        disabled={true}
      />
    </div>
  );
}
