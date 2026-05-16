using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Api.Cruises;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Services.Factories.CruiseDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Api.Applications;

public static class ApplicationCruise
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/{applicationId:guid}/cruise", Get)
            .WithName("GetApplicationCruiseV2")
            .WithSummary("Get the visible cruise linked to an application.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Results<Ok<CruiseResponse>, NotFound>> Get(
        Guid applicationId,
        ICruiseApplicationsRepository cruiseApplicationsRepository,
        IUserPermissionVerifier userPermissionVerifier,
        ICruiseDtosFactory cruiseDtosFactory,
        CancellationToken cancellationToken
    )
    {
        var application = await cruiseApplicationsRepository.GetByIdWithForms(
            applicationId,
            cancellationToken
        );
        if (
            application?.Cruise is null
            || !await userPermissionVerifier.CanCurrentUserViewForm(application)
        )
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(
            CruiseResponse.From(await cruiseDtosFactory.Create(application.Cruise))
        );
    }
}
