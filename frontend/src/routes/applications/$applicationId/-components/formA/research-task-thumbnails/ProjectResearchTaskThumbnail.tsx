import { formatDate } from '@/lib/dateUtils';

import { ProjectResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  task: ProjectResearchTaskValues;
};
export function ProjectResearchTaskThumbnail({ task }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <span>Tytuł: {task.title}</span>•
      <span>
        {formatDate(task.startDate, 'monthYear')} - {formatDate(task.endDate, 'monthYear')}
      </span>
      •<span>Kwota: {task.financingAmount} zł</span>
    </div>
  );
}
