import dayjs from 'dayjs';

import { ProjectPreparationResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  task: ProjectPreparationResearchTaskValues;
};
export function ProjectPreparationResearchTaskThumbnail({ task }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <span>Tytuł: {task.title}</span>•<span>Data: {dayjs(task.date).format('DD.MM.YYYY')}</span>
    </div>
  );
}
