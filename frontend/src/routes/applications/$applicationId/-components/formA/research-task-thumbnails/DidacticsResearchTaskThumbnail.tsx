import type { ResearchTaskFields } from '@/api/generated/schemas';

type Props = {
  task: ResearchTaskFields;
};
export function DidacticsResearchTaskThumbnail({ task }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <div>Opis: {task.description}</div>
    </div>
  );
}
