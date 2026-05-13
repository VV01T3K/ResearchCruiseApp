import { ReadOnlyDidacticsResearchTaskDetails } from '@/components/applications/research-task-display/readonly/ReadOnlyDidacticsResearchTaskDetails';
import { ReadOnlyOtherResearchTaskDetails } from '@/components/applications/research-task-display/readonly/ReadOnlyOtherResearchTaskDetails';
import { ReadOnlyOwnResearchTaskDetails } from '@/components/applications/research-task-display/readonly/ReadOnlyOwnResearchTaskDetails';
import { ReadOnlyProjectPreparationResearchTaskDetails } from '@/components/applications/research-task-display/readonly/ReadOnlyProjectPreparationResearchTaskDetails';
import { ReadOnlyProjectResearchTaskDetails } from '@/components/applications/research-task-display/readonly/ReadOnlyProjectResearchTaskDetails';
import { ReadOnlyThesisResearchTaskDetails } from '@/components/applications/research-task-display/readonly/ReadOnlyThesisResearchTaskDetails';
import {
  DidacticsResearchTaskDto,
  OtherResearchTaskDto,
  OwnResearchTaskDto,
  ProjectPreparationResearchTaskDto,
  ProjectResearchTaskDto,
  ResearchTaskDto,
  ResearchTaskType,
  ThesisResearchTaskDto,
} from '@/api/dto/applications/ResearchTaskDto';

type Props = {
  data: ResearchTaskDto;
};
export function ReadOnlyResearchTaskDetails({ data }: Props) {
  switch (data.type) {
    case ResearchTaskType.BachelorThesis:
    case ResearchTaskType.MasterThesis:
    case ResearchTaskType.DoctoralThesis:
      return <ReadOnlyThesisResearchTaskDetails data={data as ThesisResearchTaskDto} />;
    case ResearchTaskType.ProjectPreparation:
      return <ReadOnlyProjectPreparationResearchTaskDetails data={data as ProjectPreparationResearchTaskDto} />;
    case ResearchTaskType.DomesticProject:
    case ResearchTaskType.ForeignProject:
    case ResearchTaskType.InternalUgProject:
    case ResearchTaskType.OtherProject:
    case ResearchTaskType.CommercialProject:
      return <ReadOnlyProjectResearchTaskDetails data={data as ProjectResearchTaskDto} />;
    case ResearchTaskType.Didactics:
      return <ReadOnlyDidacticsResearchTaskDetails data={data as DidacticsResearchTaskDto} />;
    case ResearchTaskType.OwnResearchTask:
      return <ReadOnlyOwnResearchTaskDetails data={data as OwnResearchTaskDto} />;
    case ResearchTaskType.OtherResearchTask:
      return <ReadOnlyOtherResearchTaskDetails data={data as OtherResearchTaskDto} />;
    default:
      throw new Error(`Unknown research task type`);
  }
}
