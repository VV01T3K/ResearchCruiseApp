import dayjs from 'dayjs';

import { ProjectResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  task: ProjectResearchTaskValues;
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
