using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications;

public static class CruisePlanningEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/for-cruise-planning", Get)
            .WithName("GetApplicationsForCruisePlanning")
            .WithSummary("Get applications eligible for cruise planning.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Ok<List<CruiseApplicationCandidateResponse>>> Get(
        Guid? cruiseId,
        ApplicationReader projection,
        ApplicationDbContext dbContext,
        UserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var applications = await dbContext
            .CruiseApplications.IncludeForms()
            .IncludeFormAPoints()
            .IncludeCruise()
            .ToListAsync(cancellationToken);
        var visibleApplications = new List<CruiseApplicationCandidateResponse>();

        foreach (var application in applications)
        {
            // Always include applications already attached to the cruise being edited,
            // regardless of status, so it doesn't drop off its own candidate list.
            var isEligible =
                application.Status == CruiseApplicationStatus.Accepted
                || (cruiseId is not null && application.Cruise?.Id == cruiseId);

            if (
                isEligible
                && await userPermissionVerifier.CanCurrentUserViewCruiseApplication(application)
            )
            {
                visibleApplications.Add(await projection.CreateCandidate(application));
            }
        }

        return TypedResults.Ok(visibleApplications);
    }
}
