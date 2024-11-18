using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetEffectsEvaluations;


public record GetEffectsEvaluationsQuery(Guid UserId) : IRequest<Result<List<UserEffectDto>>>;