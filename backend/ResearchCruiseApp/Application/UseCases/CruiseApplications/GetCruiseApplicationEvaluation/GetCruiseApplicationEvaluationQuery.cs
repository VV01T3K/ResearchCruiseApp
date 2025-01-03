using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetCruiseApplicationEvaluation;

public record GetCruiseApplicationEvaluationQuery(Guid Id)
    : IRequest<Result<CruiseApplicationEvaluationDetailsDto>>;
