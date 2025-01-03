using AutoMapper;
using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetEffectsEvaluations;

public class GetEffectsEvaluationsHandler(
    IIdentityService identityService,
    IUserEffectsRepository userEffectsRepository,
    IMapper mapper
) : IRequestHandler<GetEffectsEvaluationsQuery, Result<List<UserEffectDto>>>
{
    public async Task<Result<List<UserEffectDto>>> Handle(
        GetEffectsEvaluationsQuery request,
        CancellationToken cancellationToken
    )
    {
        if (!await identityService.UserWithIdExists(request.UserId))
            return Error.ResourceNotFound("Użytkownik o podanym identyfikatorze nie istnieje.");

        var userEffects = await userEffectsRepository.GetAllByUserIdWithCruiseApplication(
            request.UserId,
            cancellationToken
        );

        return userEffects.Select(mapper.Map<UserEffectDto>).ToList();
    }
}
