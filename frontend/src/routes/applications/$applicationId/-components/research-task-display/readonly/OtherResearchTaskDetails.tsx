import { AppInput } from '@/components/shared/inputs/AppInput';
import type { ResearchTaskDetailsData } from './ResearchTaskDetails';

type Props = {
  data: ResearchTaskDetailsData;
};
export function OtherResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <AppInput
        name="researchTasks[].description"
        value={data.description ?? ''}
        label="Opis zadania"
        placeholder="Wprowadź opis zadania"
        disabled={true}
      />
    </div>
  );
}
