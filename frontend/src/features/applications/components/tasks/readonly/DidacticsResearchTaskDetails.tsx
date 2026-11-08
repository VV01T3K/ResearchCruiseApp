import { ReadonlyField } from '@/features/applications/components/ReadonlyField';
import type { DidacticsResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

type Props = {
  data: DidacticsResearchTaskValues;
};
export function DidacticsResearchTaskDetails({ data }: Props) {
  return (
    <dl className="text-left">
      <ReadonlyField label="Opis zajęcia dydaktycznego">{data.description}</ReadonlyField>
    </dl>
  );
}
