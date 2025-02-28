import { ThesisResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  task: ThesisResearchTaskDto;
};
export function ThesisResearchTaskThumbnail({ task }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <span>Tytuł: {task.title}</span>•<span>Autor: {task.author}</span>
    </div>
  );
}
