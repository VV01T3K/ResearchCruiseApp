using AutoMapper;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetOwnEffectsEvaluations;


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
            return Error.NotFound();

        var userEffects = await userEffectsRepository
            .GetAllByUserIdWithCruiseApplication((Guid)userId, cancellationToken);
        
        return userEffects
            .Select(mapper.Map<UserEffectDto>)
            .ToList();
    }
}