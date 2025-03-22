import { AppInput } from '@/core/components/inputs/AppInput';
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { AppDatePickerInput } from '@/core/components/inputs/dates/AppDatePickerInput';
import { OwnResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  data: OwnResearchTaskDto;
};
export function ReadOnlyOwnResearchTaskDetails({ data }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AppInput
        name="researchTasks[].title"
        value={data.title}
        label="Roboczy tytuł projektu"
        placeholder="Wprowadź tytuł"
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

      <AppInput
        name="researchTasks[].magazine"
        value={data.magazine}
        label="Czasopismo"
        placeholder="Wprowadź czasopismo"
        required
        disabled={true}
      />

      <AppNumberInput
        name="researchTasks[].ministerialPoints"
        value={parseInt(data.ministerialPoints)}
        minimum={0}
        step={10}
        label="Przewidywane punkty ministerialne"
        required
        disabled={true}
      />
    </div>
  );
}
