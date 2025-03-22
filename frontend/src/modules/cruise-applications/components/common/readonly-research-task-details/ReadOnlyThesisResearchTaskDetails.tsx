import { AppInput } from '@/core/components/inputs/AppInput';
import { ThesisResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  data: ThesisResearchTaskDto;
};
export function ReadOnlyThesisResearchTaskDetails({ data }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AppInput
        name="researchTasks[].author"
        value={data.author}
        label="Autor"
        placeholder="Wprowadź autora"
        required
        disabled={true}
      />

      <AppInput
        name="researchTasks[].title"
        value={data.title}
        label="Tytuł"
        placeholder="Wprowadź tytuł"
        required
        disabled={true}
      />
    </div>
  );
}
