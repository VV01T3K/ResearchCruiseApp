import { formatDate } from '@/lib/dateUtils';

import { OwnResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  data: OwnResearchTaskValues;
};
export function PrintableOwnResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span>Roboczy tytuł projektu: </span>
        <span>{data.title}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Przewidywany termin składania: </span>
        <span>{formatDate(data.date, 'date')}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Czasopismo: </span>
        <span>{data.magazine}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Przewidywane punkty ministerialne: </span>
        <span>{data.ministerialPoints}</span>
      </div>
    </div>
  );
}
