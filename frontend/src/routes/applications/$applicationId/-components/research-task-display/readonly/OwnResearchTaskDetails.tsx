import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppNumberInput } from '@/components/shared/inputs/AppNumberInput';
import { AppDatePickerInput } from '@/components/shared/inputs/dates/AppDatePickerInput';
import { OwnResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  data: OwnResearchTaskValues;
};
export function OwnResearchTaskDetails({ data }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <AppInput
        name="researchTasks[].title"
        value={data.title}
        label="Roboczy tytuł projektu"
        placeholder="Wprowadź tytuł"
        disabled={true}
      />

      <AppDatePickerInput
        name="researchTasks[].date"
        value={data.date}
        label="Przewidywany termin składania"
        disabled={true}
      />

      <AppInput
        name="researchTasks[].magazine"
        value={data.magazine}
        label="Czasopismo"
        placeholder="Wprowadź czasopismo"
        disabled={true}
      />

      <AppNumberInput
        name="researchTasks[].ministerialPoints"
        value={data.ministerialPoints}
        minimum={0}
        step={10}
        label="Przewidywane punkty ministerialne"
        disabled={true}
      />
    </div>
  );
}
