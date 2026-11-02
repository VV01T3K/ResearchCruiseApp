import { Input } from '@/components/shared/inputs/Input';
import { NumberInput } from '@/components/shared/inputs/NumberInput';
import { DatePickerInput } from '@/components/shared/inputs/dates/DatePickerInput';
import { useUnreadableErrors } from '@/integrations/tanstack/form/unreadableValues';
import type { OwnResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

type Props = {
  data: OwnResearchTaskValues;
};
export function OwnResearchTaskDetails({ data }: Props) {
  const pointsErrors = useUnreadableErrors('researchTasks[].ministerialPoints', data.ministerialPoints, true);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Input
        name="researchTasks[].title"
        value={data.title}
        label="Roboczy tytuł projektu"
        placeholder="Wprowadź tytuł"
        disabled={true}
      />

      <DatePickerInput
        name="researchTasks[].date"
        value={data.date}
        label="Przewidywany termin składania"
        disabled={true}
      />

      <Input
        name="researchTasks[].magazine"
        value={data.magazine}
        label="Czasopismo"
        placeholder="Wprowadź czasopismo"
        disabled={true}
      />

      <NumberInput
        nullable
        name="researchTasks[].ministerialPoints"
        value={data.ministerialPoints}
        errors={pointsErrors}
        minimum={0}
        step={10}
        label="Przewidywane punkty ministerialne"
        disabled={true}
      />
    </div>
  );
}
