import { OtherResearchTaskDto } from '@/api/dto/applications/ResearchTaskDto';

type Props = {
  task: OtherResearchTaskDto;
};
export function OtherResearchTaskThumbnail({ task }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <div>Opis: {task.description}</div>
    </div>
  );
}
