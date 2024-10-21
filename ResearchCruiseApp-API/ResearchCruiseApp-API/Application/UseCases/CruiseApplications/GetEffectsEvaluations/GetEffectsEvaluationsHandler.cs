using AutoMapper;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetEffectsEvaluations;


public class GetEffectsEvaluationsHandler(
    IIdentityService identityService,
    IUserEffectsRepository userEffectsRepository,
    IMapper mapper)
    : IRequestHandler<GetEffectsEvaluationsQuery, Result<List<UserEffectDto>>>
{
    public async Task<Result<List<UserEffectDto>>> Handle(
        GetEffectsEvaluationsQuery request, CancellationToken cancellationToken)
    {
        if (!await identityService.UserWithIdExists(request.UserId))
            return Error.ResourceNotFound("Użytkownik o podanym identyfikatorze nie istnieje.");
        
        var userEffects = await userEffectsRepository
            .GetAllByUserIdWithCruiseApplication(request.UserId, cancellationToken);

        return userEffects
            .Select(mapper.Map<UserEffectDto>)
            .ToList();
    }
}