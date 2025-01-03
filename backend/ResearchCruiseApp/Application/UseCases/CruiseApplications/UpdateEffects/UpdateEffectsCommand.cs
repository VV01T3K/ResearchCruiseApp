using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.UpdateEffects;

public record UpdateEffectsCommand(Guid CruiseApplicationId, EffectsUpdatesDto EffectsUpdatesDto)
    : IRequest<Result>;
