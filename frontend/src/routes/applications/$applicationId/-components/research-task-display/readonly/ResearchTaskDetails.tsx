import { DidacticsResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/DidacticsResearchTaskDetails';
import { OtherResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/OtherResearchTaskDetails';
import { OwnResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/OwnResearchTaskDetails';
import { ProjectPreparationResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/ProjectPreparationResearchTaskDetails';
import { ProjectResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/ProjectResearchTaskDetails';
import { ThesisResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/ThesisResearchTaskDetails';
import {
  ResearchTaskType,
  type ResearchTaskValues,
} from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  data: ResearchTaskValues;
};
export function ResearchTaskDetails({ data }: Props) {
  switch (data.type) {
    case ResearchTaskType.BachelorThesis:
    case ResearchTaskType.MasterThesis:
    case ResearchTaskType.DoctoralThesis:
      return <ThesisResearchTaskDetails data={data} />;
    case ResearchTaskType.ProjectPreparation:
      return <ProjectPreparationResearchTaskDetails data={data} />;
    case ResearchTaskType.DomesticProject:
    case ResearchTaskType.ForeignProject:
    case ResearchTaskType.InternalUgProject:
    case ResearchTaskType.OtherProject:
    case ResearchTaskType.CommercialProject:
      return <ProjectResearchTaskDetails data={data} />;
    case ResearchTaskType.Didactics:
      return <DidacticsResearchTaskDetails data={data} />;
    case ResearchTaskType.OwnResearchTask:
      return <OwnResearchTaskDetails data={data} />;
    case ResearchTaskType.OtherResearchTask:
      return <OtherResearchTaskDetails data={data} />;
  }
}
