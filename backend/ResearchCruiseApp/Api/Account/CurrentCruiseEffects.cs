using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Api.Account;

public static class CurrentCruiseEffects
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/me/cruise-effects", Get)
            .WithName("GetCurrentUserCruiseEffectsV2")
            .WithSummary("Get cruise effects for the current user.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Results<Ok<List<UserEffectDto>>, NotFound>> Get(
        ICurrentUserService currentUserService,
        IUserEffectsRepository userEffectsRepository,
        IMapper mapper,
        CancellationToken cancellationToken
    )
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
        {
            return TypedResults.NotFound();
        }

        var userEffects = await userEffectsRepository.GetAllByUserIdWithCruiseApplication(
            currentUserId.Value,
            cancellationToken
        );

        return TypedResults.Ok(userEffects.Select(mapper.Map<UserEffectDto>).ToList());
    }
}
