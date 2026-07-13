import { DidacticsResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/DidacticsResearchTaskDetails';
import { OtherResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/OtherResearchTaskDetails';
import { OwnResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/OwnResearchTaskDetails';
import { ProjectPreparationResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/ProjectPreparationResearchTaskDetails';
import { ProjectResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/ProjectResearchTaskDetails';
import { ThesisResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/ThesisResearchTaskDetails';
import {
  DidacticsResearchTaskDto,
  OtherResearchTaskDto,
  OwnResearchTaskDto,
  ProjectPreparationResearchTaskDto,
  ProjectResearchTaskDto,
  ResearchTaskDto,
  ResearchTaskType,
  ThesisResearchTaskDto,
} from '@/api/applications/dto/ResearchTaskDto';

type Props = {
  data: ResearchTaskDto;
};
export function ResearchTaskDetails({ data }: Props) {
  switch (data.type) {
    case ResearchTaskType.BachelorThesis:
    case ResearchTaskType.MasterThesis:
    case ResearchTaskType.DoctoralThesis:
      return <ThesisResearchTaskDetails data={data as ThesisResearchTaskDto} />;
    case ResearchTaskType.ProjectPreparation:
      return <ProjectPreparationResearchTaskDetails data={data as ProjectPreparationResearchTaskDto} />;
    case ResearchTaskType.DomesticProject:
    case ResearchTaskType.ForeignProject:
    case ResearchTaskType.InternalUgProject:
    case ResearchTaskType.OtherProject:
    case ResearchTaskType.CommercialProject:
      return <ProjectResearchTaskDetails data={data as ProjectResearchTaskDto} />;
    case ResearchTaskType.Didactics:
      return <DidacticsResearchTaskDetails data={data as DidacticsResearchTaskDto} />;
    case ResearchTaskType.OwnResearchTask:
      return <OwnResearchTaskDetails data={data as OwnResearchTaskDto} />;
    case ResearchTaskType.OtherResearchTask:
      return <OtherResearchTaskDetails data={data as OtherResearchTaskDto} />;
    default:
      throw new Error(`Unknown research task type`);
  }
}
