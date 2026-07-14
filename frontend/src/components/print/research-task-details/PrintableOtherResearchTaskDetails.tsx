import { OtherResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  data: OtherResearchTaskValues;
};
export function PrintableOtherResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span>Opis zadania:</span>
        <span>{data.description}</span>
      </div>
    </div>
  );
}
