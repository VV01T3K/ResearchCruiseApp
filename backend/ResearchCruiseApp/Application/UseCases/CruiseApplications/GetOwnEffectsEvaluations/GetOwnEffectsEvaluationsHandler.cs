using AutoMapper;
using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetOwnEffectsEvaluations;


public class GetOwnEffectsEvaluationsHandler(
    ICurrentUserService currentUserService,
    IUserEffectsRepository userEffectsRepository,
    IMapper mapper)
    : IRequestHandler<GetOwnEffectsEvaluationsQuery, Result<List<UserEffectDto>>>
{
    public async Task<Result<List<UserEffectDto>>> Handle(
        GetOwnEffectsEvaluationsQuery request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.GetId();
        if (userId is null)
            return Error.ResourceNotFound();

        var userEffects = await userEffectsRepository
            .GetAllByUserIdWithCruiseApplication((Guid)userId, cancellationToken);
        
        return userEffects
            .Select(mapper.Map<UserEffectDto>)
            .ToList();
    }
}