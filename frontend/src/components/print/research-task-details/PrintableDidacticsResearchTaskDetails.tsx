import { DidacticsResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  data: DidacticsResearchTaskValues;
};
export function PrintableDidacticsResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span>Opis zajęcia dydaktycznego:</span>
        <span>{data.description}</span>
      </div>
    </div>
  );
}
