import { DidacticsResearchTaskThumbnail } from '@/routes/applications/$applicationId/-components/formA/research-task-thumbnails/DidacticsResearchTaskThumbnail';
import { OtherResearchTaskThumbnail } from '@/routes/applications/$applicationId/-components/formA/research-task-thumbnails/OtherResearchTaskThumbnail';
import { OwnResearchTaskThumbnail } from '@/routes/applications/$applicationId/-components/formA/research-task-thumbnails/OwnResearchTaskThumbnail';
import { ProjectPreparationResearchTaskThumbnail } from '@/routes/applications/$applicationId/-components/formA/research-task-thumbnails/ProjectPreparationResearchTaskThumbnail';
import { ProjectResearchTaskThumbnail } from '@/routes/applications/$applicationId/-components/formA/research-task-thumbnails/ProjectResearchTaskThumbnail';
import { ThesisResearchTaskThumbnail } from '@/routes/applications/$applicationId/-components/formA/research-task-thumbnails/ThesisResearchTaskThumbnail';
import { ResearchTaskDto, ResearchTaskType } from '@/api/applications/dto/ResearchTaskDto';

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
