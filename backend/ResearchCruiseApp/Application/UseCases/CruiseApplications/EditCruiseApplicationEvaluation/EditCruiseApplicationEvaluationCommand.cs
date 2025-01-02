using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.EditCruiseApplicationEvaluation;


public record EditCruiseApplicationEvaluationCommand(
    Guid Id,
    CruiseApplicationEvaluationsEditsDto CruiseApplicationEvaluationsEditsDto)
    : IRequest<Result>;