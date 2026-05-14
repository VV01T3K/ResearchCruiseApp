import dayjs from 'dayjs';

import { ProjectResearchTaskDto } from '@/api/dto/applications/ResearchTaskDto';

type Props = {
  task: ProjectResearchTaskDto;
};
export function ProjectResearchTaskThumbnail({ task }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <span>Tytuł: {task.title}</span>•
      <span>
        {dayjs(task.startDate).format('MM.YYYY')} - {dayjs(task.endDate).format('MM.YYYY')}
      </span>
      •<span>Kwota: {task.financingAmount} zł</span>
    </div>
  );
}
