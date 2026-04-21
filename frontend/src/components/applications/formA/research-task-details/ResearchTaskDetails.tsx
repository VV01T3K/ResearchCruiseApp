import { Row } from '@tanstack/react-table';

import { AnyReactFormApi } from '@/lib/form';
import { DidacticsResearchTaskDetails } from '@/components/applications/formA/research-task-details/DidacticsResearchTaskDetails';
import { OtherResearchTaskDetails } from '@/components/applications/formA/research-task-details/OtherResearchTaskDetails';
import { OwnResearchTaskDetails } from '@/components/applications/formA/research-task-details/OwnResearchTaskDetails';
import { ProjectPreparationResearchTaskDetails } from '@/components/applications/formA/research-task-details/ProjectPreparationResearchTaskDetails';
import { ProjectResearchTaskDetails } from '@/components/applications/formA/research-task-details/ProjectResearchTaskDetails';
import { ThesisResearchTaskDetails } from '@/components/applications/formA/research-task-details/ThesisResearchTaskDetails';
import { FormADto } from '@/api/dto/applications/FormADto';
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
  form: AnyReactFormApi<FormADto>;
  row: Row<ResearchTaskDto>;
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
          row={row as Row<ThesisResearchTaskDto>}
          disabled={disabled}
          hasFormBeenSubmitted={hasFormBeenSubmitted}
        />
      );
    case ResearchTaskType.ProjectPreparation:
      return (
        <ProjectPreparationResearchTaskDetails
          form={form}
          row={row as Row<ProjectPreparationResearchTaskDto>}
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
          row={row as Row<ProjectResearchTaskDto>}
          disabled={disabled}
          hasFormBeenSubmitted={hasFormBeenSubmitted}
        />
      );
    case ResearchTaskType.Didactics:
      return (
        <DidacticsResearchTaskDetails
          form={form}
          row={row as Row<DidacticsResearchTaskDto>}
          disabled={disabled}
          hasFormBeenSubmitted={hasFormBeenSubmitted}
        />
      );
    case ResearchTaskType.OwnResearchTask:
      return (
        <OwnResearchTaskDetails
          form={form}
          row={row as Row<OwnResearchTaskDto>}
          disabled={disabled}
          hasFormBeenSubmitted={hasFormBeenSubmitted}
        />
      );
    case ResearchTaskType.OtherResearchTask:
      return (
        <OtherResearchTaskDetails
          form={form}
          row={row as Row<OtherResearchTaskDto>}
          disabled={disabled}
          hasFormBeenSubmitted={hasFormBeenSubmitted}
        />
      );
    default:
      throw new Error(`Unknown research task type`);
  }
}
