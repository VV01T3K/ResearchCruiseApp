using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications;

public static class EvaluationEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/{applicationId:guid}/evaluation", Get)
            .WithName("GetApplicationEvaluation")
            .WithSummary("Get application evaluation details.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Results<Ok<CruiseApplicationEvaluation>, NotFound>> Get(
        Guid applicationId,
        ApplicationDbContext dbContext,
        ApplicationReader applications,
        UserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var application = await dbContext
            .CruiseApplications.IncludeForms()
            .IncludeFormAContent()
            .SingleOrDefaultAsync(
                application => application.Id == applicationId,
                cancellationToken
            );
        if (
            application is null
            || !await userPermissionVerifier.CanCurrentUserViewCruiseApplication(application)
        )
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(await applications.CreateEvaluationDetails(application));
    }
}
