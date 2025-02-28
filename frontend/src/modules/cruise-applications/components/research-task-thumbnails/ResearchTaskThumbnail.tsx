import { DidacticsResearchTaskThumbnail } from '@/cruise-applications/components/research-task-thumbnails/DidacticsResearchTaskThumbnail';
import { OtherResearchTaskThumbnail } from '@/cruise-applications/components/research-task-thumbnails/OtherResearchTaskThumbnail';
import { OwnResearchTaskThumbnail } from '@/cruise-applications/components/research-task-thumbnails/OwnResearchTaskThumbnail';
import { ProjectPreparationResearchTaskThumbnail } from '@/cruise-applications/components/research-task-thumbnails/ProjectPreparationResearchTaskThumbnail';
import { ProjectResearchTaskThumbnail } from '@/cruise-applications/components/research-task-thumbnails/ProjectResearchTaskThumbnail';
import { ThesisResearchTaskThumbnail } from '@/cruise-applications/components/research-task-thumbnails/ThesisResearchTaskThumbnail';
import { ResearchTaskDto, ResearchTaskType } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  task: ResearchTaskDto;
};
export function ResearchTaskThumbnail({ task }: Props) {
  switch (task.type) {
    case ResearchTaskType.BachelorThesis:
    case ResearchTaskType.MasterThesis:
    case ResearchTaskType.DoctoralThesis:
      return <ThesisResearchTaskThumbnail task={task} />;
    case ResearchTaskType.ProjectPreparation:
      return <ProjectPreparationResearchTaskThumbnail task={task} />;
    case ResearchTaskType.DomesticProject:
    case ResearchTaskType.ForeignProject:
    case ResearchTaskType.InternalUgProject:
    case ResearchTaskType.OtherProject:
    case ResearchTaskType.CommercialProject:
      return <ProjectResearchTaskThumbnail task={task} />;
    case ResearchTaskType.Didactics:
      return <DidacticsResearchTaskThumbnail task={task} />;
    case ResearchTaskType.OwnResearchTask:
      return <OwnResearchTaskThumbnail task={task} />;
    case ResearchTaskType.OtherResearchTask:
      return <OtherResearchTaskThumbnail task={task} />;
    default:
      throw new Error(`Unknown research task type`);
  }
}
