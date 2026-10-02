import { DidacticsResearchTaskThumbnail } from '@/routes/applications/$applicationId/-components/formA/research-task-thumbnails/DidacticsResearchTaskThumbnail';
import { OtherResearchTaskThumbnail } from '@/routes/applications/$applicationId/-components/formA/research-task-thumbnails/OtherResearchTaskThumbnail';
import { OwnResearchTaskThumbnail } from '@/routes/applications/$applicationId/-components/formA/research-task-thumbnails/OwnResearchTaskThumbnail';
import { ProjectPreparationResearchTaskThumbnail } from '@/routes/applications/$applicationId/-components/formA/research-task-thumbnails/ProjectPreparationResearchTaskThumbnail';
import { ProjectResearchTaskThumbnail } from '@/routes/applications/$applicationId/-components/formA/research-task-thumbnails/ProjectResearchTaskThumbnail';
import { ThesisResearchTaskThumbnail } from '@/routes/applications/$applicationId/-components/formA/research-task-thumbnails/ThesisResearchTaskThumbnail';
import type { ResearchTaskFields } from '@/api/generated/schemas';
import { ResearchTaskType } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  task: ResearchTaskFields;
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
    default:
      // Matches mapResearchTaskToValues, which adds unknown historical types as other tasks.
      return <OtherResearchTaskThumbnail task={task} />;
  }
}
