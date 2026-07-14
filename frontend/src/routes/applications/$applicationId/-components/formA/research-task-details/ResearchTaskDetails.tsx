import { Row } from '@tanstack/react-table';

import type { FormAFormApi } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { DidacticsResearchTaskDetails } from '@/routes/applications/$applicationId/-components/formA/research-task-details/DidacticsResearchTaskDetails';
import { OtherResearchTaskDetails } from '@/routes/applications/$applicationId/-components/formA/research-task-details/OtherResearchTaskDetails';
import { OwnResearchTaskDetails } from '@/routes/applications/$applicationId/-components/formA/research-task-details/OwnResearchTaskDetails';
import { ProjectPreparationResearchTaskDetails } from '@/routes/applications/$applicationId/-components/formA/research-task-details/ProjectPreparationResearchTaskDetails';
import { ProjectResearchTaskDetails } from '@/routes/applications/$applicationId/-components/formA/research-task-details/ProjectResearchTaskDetails';
import { ThesisResearchTaskDetails } from '@/routes/applications/$applicationId/-components/formA/research-task-details/ThesisResearchTaskDetails';
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
  form: FormAFormApi;
  row: Row<ResearchTaskValues>;
  disabled?: boolean;
  hasFormBeenSubmitted?: boolean;
};
export function ResearchTaskDetails({ form, row, disabled, hasFormBeenSubmitted }: Props) {
  switch (row.original.type) {
    case ResearchTaskType.BachelorThesis:
    case ResearchTaskType.MasterThesis:
    case ResearchTaskType.DoctoralThesis:
      return (
        <ThesisResearchTaskDetails
          form={form}
          row={row as Row<ThesisResearchTaskValues>}
          disabled={disabled}
          hasFormBeenSubmitted={hasFormBeenSubmitted}
        />
      );
    case ResearchTaskType.ProjectPreparation:
      return (
        <ProjectPreparationResearchTaskDetails
          form={form}
          row={row as Row<ProjectPreparationResearchTaskValues>}
          disabled={disabled}
          hasFormBeenSubmitted={hasFormBeenSubmitted}
        />
      );
    case ResearchTaskType.DomesticProject:
    case ResearchTaskType.ForeignProject:
    case ResearchTaskType.InternalUgProject:
    case ResearchTaskType.OtherProject:
    case ResearchTaskType.CommercialProject:
      return (
        <ProjectResearchTaskDetails
          form={form}
          row={row as Row<ProjectResearchTaskValues>}
          disabled={disabled}
          hasFormBeenSubmitted={hasFormBeenSubmitted}
        />
      );
    case ResearchTaskType.Didactics:
      return (
        <DidacticsResearchTaskDetails
          form={form}
          row={row as Row<DidacticsResearchTaskValues>}
          disabled={disabled}
          hasFormBeenSubmitted={hasFormBeenSubmitted}
        />
      );
    case ResearchTaskType.OwnResearchTask:
      return (
        <OwnResearchTaskDetails
          form={form}
          row={row as Row<OwnResearchTaskValues>}
          disabled={disabled}
          hasFormBeenSubmitted={hasFormBeenSubmitted}
        />
      );
    case ResearchTaskType.OtherResearchTask:
      return (
        <OtherResearchTaskDetails
          form={form}
          row={row as Row<OtherResearchTaskValues>}
          disabled={disabled}
          hasFormBeenSubmitted={hasFormBeenSubmitted}
        />
      );
    default:
      throw new Error(`Unknown research task type`);
  }
}
