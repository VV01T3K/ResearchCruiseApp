import { Row } from '@tanstack/react-table';

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
  row: Row<ResearchTaskValues>;
  disabled?: boolean;
  submissionAttempts?: number;
};
export function ResearchTaskDetails({ row, disabled, submissionAttempts }: Props) {
  switch (row.original.type) {
    case ResearchTaskType.BachelorThesis:
    case ResearchTaskType.MasterThesis:
    case ResearchTaskType.DoctoralThesis:
      return (
        <ThesisResearchTaskDetails
          row={row as Row<ThesisResearchTaskValues>}
          disabled={disabled}
          submissionAttempts={submissionAttempts}
        />
      );
    case ResearchTaskType.ProjectPreparation:
      return (
        <ProjectPreparationResearchTaskDetails
          row={row as Row<ProjectPreparationResearchTaskValues>}
          disabled={disabled}
          submissionAttempts={submissionAttempts}
        />
      );
    case ResearchTaskType.DomesticProject:
    case ResearchTaskType.ForeignProject:
    case ResearchTaskType.InternalUgProject:
    case ResearchTaskType.OtherProject:
    case ResearchTaskType.CommercialProject:
      return (
        <ProjectResearchTaskDetails
          row={row as Row<ProjectResearchTaskValues>}
          disabled={disabled}
          submissionAttempts={submissionAttempts}
        />
      );
    case ResearchTaskType.Didactics:
      return (
        <DidacticsResearchTaskDetails
          row={row as Row<DidacticsResearchTaskValues>}
          disabled={disabled}
          submissionAttempts={submissionAttempts}
        />
      );
    case ResearchTaskType.OwnResearchTask:
      return (
        <OwnResearchTaskDetails
          row={row as Row<OwnResearchTaskValues>}
          disabled={disabled}
          submissionAttempts={submissionAttempts}
        />
      );
    case ResearchTaskType.OtherResearchTask:
      return (
        <OtherResearchTaskDetails
          row={row as Row<OtherResearchTaskValues>}
          disabled={disabled}
          submissionAttempts={submissionAttempts}
        />
      );
    default:
      throw new Error(`Unknown research task type`);
  }
}
