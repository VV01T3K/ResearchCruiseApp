import { DidacticsResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/DidacticsResearchTaskDetails';
import { OtherResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/OtherResearchTaskDetails';
import { OwnResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/OwnResearchTaskDetails';
import { ProjectPreparationResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/ProjectPreparationResearchTaskDetails';
import { ProjectResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/ProjectResearchTaskDetails';
import { ThesisResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/ThesisResearchTaskDetails';
import {
  DidacticsResearchTaskValues,
  OtherResearchTaskValues,
  OwnResearchTaskValues,
  ProjectPreparationResearchTaskValues,
  ProjectResearchTaskValues,
  ResearchTaskValues,
  ResearchTaskType,
  ThesisResearchTaskValues,
} from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  data: ResearchTaskValues;
};
export function ResearchTaskDetails({ data }: Props) {
  switch (data.type) {
    case ResearchTaskType.BachelorThesis:
    case ResearchTaskType.MasterThesis:
    case ResearchTaskType.DoctoralThesis:
      return <ThesisResearchTaskDetails data={data as ThesisResearchTaskValues} />;
    case ResearchTaskType.ProjectPreparation:
      return <ProjectPreparationResearchTaskDetails data={data as ProjectPreparationResearchTaskValues} />;
    case ResearchTaskType.DomesticProject:
    case ResearchTaskType.ForeignProject:
    case ResearchTaskType.InternalUgProject:
    case ResearchTaskType.OtherProject:
    case ResearchTaskType.CommercialProject:
      return <ProjectResearchTaskDetails data={data as ProjectResearchTaskValues} />;
    case ResearchTaskType.Didactics:
      return <DidacticsResearchTaskDetails data={data as DidacticsResearchTaskValues} />;
    case ResearchTaskType.OwnResearchTask:
      return <OwnResearchTaskDetails data={data as OwnResearchTaskValues} />;
    case ResearchTaskType.OtherResearchTask:
      return <OtherResearchTaskDetails data={data as OtherResearchTaskValues} />;
    default:
      throw new Error(`Unknown research task type`);
  }
}
