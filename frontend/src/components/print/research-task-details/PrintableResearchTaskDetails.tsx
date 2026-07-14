import { PrintableDidacticsResearchTaskDetails } from '@/components/print/research-task-details/PrintableDidacticsResearchTaskDetails';
import { PrintableOtherResearchTaskDetails } from '@/components/print/research-task-details/PrintableOtherResearchTaskDetails';
import { PrintableOwnResearchTaskDetails } from '@/components/print/research-task-details/PrintableOwnResearchTaskDetails';
import { PrintableProjectPreparationResearchTaskDetails } from '@/components/print/research-task-details/PrintableProjectPreparationResearchTaskDetails';
import { PrintableProjectResearchTaskDetails } from '@/components/print/research-task-details/PrintableProjectResearchTaskDetails';
import { PrintableThesisResearchTaskDetails } from '@/components/print/research-task-details/PrintableThesisResearchTaskDetails';
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
export function PrintableResearchTaskDetails({ data }: Props) {
  switch (data.type) {
    case ResearchTaskType.BachelorThesis:
    case ResearchTaskType.MasterThesis:
    case ResearchTaskType.DoctoralThesis:
      return <PrintableThesisResearchTaskDetails data={data as ThesisResearchTaskValues} />;
    case ResearchTaskType.ProjectPreparation:
      return <PrintableProjectPreparationResearchTaskDetails data={data as ProjectPreparationResearchTaskValues} />;
    case ResearchTaskType.DomesticProject:
    case ResearchTaskType.ForeignProject:
    case ResearchTaskType.InternalUgProject:
    case ResearchTaskType.OtherProject:
    case ResearchTaskType.CommercialProject:
      return <PrintableProjectResearchTaskDetails data={data as ProjectResearchTaskValues} />;
    case ResearchTaskType.Didactics:
      return <PrintableDidacticsResearchTaskDetails data={data as DidacticsResearchTaskValues} />;
    case ResearchTaskType.OwnResearchTask:
      return <PrintableOwnResearchTaskDetails data={data as OwnResearchTaskValues} />;
    case ResearchTaskType.OtherResearchTask:
      return <PrintableOtherResearchTaskDetails data={data as OtherResearchTaskValues} />;
    default:
      throw new Error(`Unknown research task type`);
  }
}
