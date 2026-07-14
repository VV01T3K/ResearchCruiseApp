import dayjs from 'dayjs';

import { ProjectPreparationResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  data: ProjectPreparationResearchTaskValues;
};
export function PrintableProjectPreparationResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span>Roboczy tytuł projektu: </span>
        <span>{data.title}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Przewidywany termin składania: </span>
        <span>{dayjs(data.date).format('DD.MM.YYYY')}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Otrzymano decyzję o finansowaniu?: </span>
        <span>{data.financingApproved ? 'Tak' : 'Nie'}</span>
      </div>
    </div>
  );
}
