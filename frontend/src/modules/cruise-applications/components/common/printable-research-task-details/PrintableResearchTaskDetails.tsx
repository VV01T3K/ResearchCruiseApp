import { PrintableDidacticsResearchTaskDetails } from '@/cruise-applications/components/common/printable-research-task-details/PrintableDidacticsResearchTaskDetails';
import { PrintableOtherResearchTaskDetails } from '@/cruise-applications/components/common/printable-research-task-details/PrintableOtherResearchTaskDetails';
import { PrintableOwnResearchTaskDetails } from '@/cruise-applications/components/common/printable-research-task-details/PrintableOwnResearchTaskDetails';
import { PrintableProjectPreparationResearchTaskDetails } from '@/cruise-applications/components/common/printable-research-task-details/PrintableProjectPreparationResearchTaskDetails';
import { PrintableProjectResearchTaskDetails } from '@/cruise-applications/components/common/printable-research-task-details/PrintableProjectResearchTaskDetails';
import { PrintableThesisResearchTaskDetails } from '@/cruise-applications/components/common/printable-research-task-details/PrintableThesisResearchTaskDetails';
import {
  DidacticsResearchTaskDto,
  OtherResearchTaskDto,
  OwnResearchTaskDto,
  ProjectPreparationResearchTaskDto,
  ProjectResearchTaskDto,
  ResearchTaskDto,
  ResearchTaskType,
  ThesisResearchTaskDto,
} from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  data: ResearchTaskDto;
};
export function PrintableResearchTaskDetails({ data }: Props) {
  switch (data.type) {
    case ResearchTaskType.BachelorThesis:
    case ResearchTaskType.MasterThesis:
    case ResearchTaskType.DoctoralThesis:
      return <PrintableThesisResearchTaskDetails data={data as ThesisResearchTaskDto} />;
    case ResearchTaskType.ProjectPreparation:
      return <PrintableProjectPreparationResearchTaskDetails data={data as ProjectPreparationResearchTaskDto} />;
    case ResearchTaskType.DomesticProject:
    case ResearchTaskType.ForeignProject:
    case ResearchTaskType.InternalUgProject:
    case ResearchTaskType.OtherProject:
    case ResearchTaskType.CommercialProject:
      return <PrintableProjectResearchTaskDetails data={data as ProjectResearchTaskDto} />;
    case ResearchTaskType.Didactics:
      return <PrintableDidacticsResearchTaskDetails data={data as DidacticsResearchTaskDto} />;
    case ResearchTaskType.OwnResearchTask:
      return <PrintableOwnResearchTaskDetails data={data as OwnResearchTaskDto} />;
    case ResearchTaskType.OtherResearchTask:
      return <PrintableOtherResearchTaskDetails data={data as OtherResearchTaskDto} />;
    default:
      throw new Error(`Unknown research task type`);
  }
}
