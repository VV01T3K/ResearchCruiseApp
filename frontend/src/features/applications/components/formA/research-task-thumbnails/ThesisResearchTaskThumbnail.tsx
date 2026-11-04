import type { ResearchTaskFields } from '@/api/generated/schemas';

type Props = {
  task: ResearchTaskFields;
};
export function ThesisResearchTaskThumbnail({ task }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <span>Tytuł: {task.title}</span>•<span>Autor: {task.author}</span>
    </div>
  );
}
