import { DidacticsResearchTaskDetails } from '@/features/applications/components/tasks/readonly/DidacticsResearchTaskDetails';
import { OtherResearchTaskDetails } from '@/features/applications/components/tasks/readonly/OtherResearchTaskDetails';
import { OwnResearchTaskDetails } from '@/features/applications/components/tasks/readonly/OwnResearchTaskDetails';
import { ProjectPreparationResearchTaskDetails } from '@/features/applications/components/tasks/readonly/ProjectPreparationResearchTaskDetails';
import { ProjectResearchTaskDetails } from '@/features/applications/components/tasks/readonly/ProjectResearchTaskDetails';
import { ThesisResearchTaskDetails } from '@/features/applications/components/tasks/readonly/ThesisResearchTaskDetails';
import { ResearchTaskType, type ResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

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
