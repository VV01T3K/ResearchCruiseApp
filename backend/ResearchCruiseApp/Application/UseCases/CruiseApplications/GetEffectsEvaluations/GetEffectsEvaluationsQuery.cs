using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetEffectsEvaluations;


public record GetEffectsEvaluationsQuery(Guid UserId) : IRequest<Result<List<UserEffectDto>>>;