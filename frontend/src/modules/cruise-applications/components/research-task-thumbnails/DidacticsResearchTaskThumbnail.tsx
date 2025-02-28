import { DidacticsResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  task: DidacticsResearchTaskDto;
};
export function DidacticsResearchTaskThumbnail({ task }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <div>Opis: {task.description}</div>
    </div>
  );
}
