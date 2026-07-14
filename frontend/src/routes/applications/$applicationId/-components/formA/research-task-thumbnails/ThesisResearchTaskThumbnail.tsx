import { ThesisResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  task: ThesisResearchTaskValues;
};
export function ThesisResearchTaskThumbnail({ task }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <span>Tytuł: {task.title}</span>•<span>Autor: {task.author}</span>
    </div>
  );
}
