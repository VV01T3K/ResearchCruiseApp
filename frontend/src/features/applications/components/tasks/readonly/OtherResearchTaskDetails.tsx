import { ReadonlyField } from '@/features/applications/components/ReadonlyField';
import type { OtherResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

type Props = {
  data: OtherResearchTaskValues;
};
export function OtherResearchTaskDetails({ data }: Props) {
  return (
    <dl className="text-left">
      <ReadonlyField label="Opis zadania">{data.description}</ReadonlyField>
    </dl>
  );
}
