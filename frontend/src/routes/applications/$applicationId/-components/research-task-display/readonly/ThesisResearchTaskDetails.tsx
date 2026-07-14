import { AppInput } from '@/components/shared/inputs/AppInput';
import { ThesisResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  data: ThesisResearchTaskValues;
};
export function ThesisResearchTaskDetails({ data }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <AppInput
        name="researchTasks[].author"
        value={data.author}
        label="Autor"
        placeholder="Wprowadź autora"
        disabled={true}
      />

      <AppInput
        name="researchTasks[].title"
        value={data.title}
        label="Tytuł"
        placeholder="Wprowadź tytuł"
        disabled={true}
      />
    </div>
  );
}
