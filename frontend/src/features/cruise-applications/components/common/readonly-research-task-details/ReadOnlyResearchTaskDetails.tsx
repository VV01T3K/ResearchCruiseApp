import { ReadOnlyDidacticsResearchTaskDetails } from '@/features/cruise-applications/components/common/readonly-research-task-details/ReadOnlyDidacticsResearchTaskDetails';
import { ReadOnlyOtherResearchTaskDetails } from '@/features/cruise-applications/components/common/readonly-research-task-details/ReadOnlyOtherResearchTaskDetails';
import { ReadOnlyOwnResearchTaskDetails } from '@/features/cruise-applications/components/common/readonly-research-task-details/ReadOnlyOwnResearchTaskDetails';
import { ReadOnlyProjectPreparationResearchTaskDetails } from '@/features/cruise-applications/components/common/readonly-research-task-details/ReadOnlyProjectPreparationResearchTaskDetails';
import { ReadOnlyProjectResearchTaskDetails } from '@/features/cruise-applications/components/common/readonly-research-task-details/ReadOnlyProjectResearchTaskDetails';
import { ReadOnlyThesisResearchTaskDetails } from '@/features/cruise-applications/components/common/readonly-research-task-details/ReadOnlyThesisResearchTaskDetails';
import {
  DidacticsResearchTaskDto,
  OtherResearchTaskDto,
  OwnResearchTaskDto,
  ProjectPreparationResearchTaskDto,
  ProjectResearchTaskDto,
  ResearchTaskDto,
  ResearchTaskType,
  ThesisResearchTaskDto,
} from '@/features/cruise-applications/models/ResearchTaskDto';

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
