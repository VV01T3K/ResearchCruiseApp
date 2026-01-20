import dayjs from 'dayjs';

import { ProjectPreparationResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  data: ProjectPreparationResearchTaskDto;
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
