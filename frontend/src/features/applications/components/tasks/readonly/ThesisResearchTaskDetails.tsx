import { ReadonlyField } from '@/features/applications/components/ReadonlyField';
import type { ThesisResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

type Props = {
  data: ThesisResearchTaskValues;
};
export function ThesisResearchTaskDetails({ data }: Props) {
  return (
    <dl className="grid grid-cols-1 gap-4 text-left lg:grid-cols-2">
      <ReadonlyField label="Autor">{data.author}</ReadonlyField>
      <ReadonlyField label="Tytuł">{data.title}</ReadonlyField>
    </dl>
  );
}
