import { Input } from '@/components/shared/inputs/Input';
import type { ThesisResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

type Props = {
  data: ThesisResearchTaskValues;
};
export function ThesisResearchTaskDetails({ data }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Input
        aria-label={`Autor, ${data.title}`}
        name="researchTasks[].author"
        value={data.author}
        label="Autor"
        placeholder="Wprowadź autora"
        disabled={true}
      />

      <Input
        aria-label={`Tytuł, ${data.title}`}
        name="researchTasks[].title"
        value={data.title}
        label="Tytuł"
        placeholder="Wprowadź tytuł"
        disabled={true}
      />
    </div>
  );
}
