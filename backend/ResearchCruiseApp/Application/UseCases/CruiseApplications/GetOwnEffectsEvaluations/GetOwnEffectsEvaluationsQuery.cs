using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetOwnEffectsEvaluations;

public record GetOwnEffectsEvaluationsQuery : IRequest<Result<List<UserEffectDto>>>;
