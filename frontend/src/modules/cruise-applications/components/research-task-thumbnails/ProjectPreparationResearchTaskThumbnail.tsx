import dayjs from 'dayjs';

import { ProjectPreparationResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  task: ProjectPreparationResearchTaskDto;
};
export function ProjectPreparationResearchTaskThumbnail({ task }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <span>Tytuł: {task.title}</span>•<span>Data: {dayjs(task.date).format('DD.MM.YYYY')}</span>
    </div>
  );
}
