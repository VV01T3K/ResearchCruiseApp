using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications;

public static class ApplicationCruiseEndpoints
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

    private static async Task<Results<Ok<ApplicationCruiseResponse>, NotFound>> Get(
        Guid applicationId,
        ApplicationDbContext dbContext,
        IUserPermissionVerifier userPermissionVerifier,
        IIdentityService identityService,
        ApplicationScoringService evaluator,
        CancellationToken cancellationToken
    )
    {
        var application = await dbContext
            .CruiseApplications.IncludeForms()
            .IncludeCruise()
            .SingleOrDefaultAsync(
                application => application.Id == applicationId,
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
            await ApplicationCruiseResponse.From(application.Cruise, identityService, evaluator)
        );
    }
}
