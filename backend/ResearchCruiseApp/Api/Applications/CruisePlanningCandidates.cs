using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Api.Applications.Factories.CruiseApplicationDtos;
using ResearchCruiseApp.Api.Common;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;

namespace ResearchCruiseApp.Api.Applications;

public static class CruisePlanningCandidates
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/for-cruise-planning", Get)
            .WithName("GetApplicationsForCruisePlanningV2")
            .WithSummary("Get applications eligible for cruise planning.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Ok<List<CruiseApplicationDto>>> Get(
        ICruiseApplicationDtosFactory cruiseApplicationDtosFactory,
        ApplicationDbContext dbContext,
        IUserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var applications = await dbContext
            .CruiseApplications.IncludeForms()
            .IncludeFormAContent()
            .ToListAsync(cancellationToken);
        var visibleApplications = new List<CruiseApplicationDto>();

        foreach (var application in applications)
        {
            if (
                application.Status == CruiseApplicationStatus.Accepted
                && await userPermissionVerifier.CanCurrentUserViewCruiseApplication(application)
            )
            {
                visibleApplications.Add(await cruiseApplicationDtosFactory.Create(application));
            }
        }

        return TypedResults.Ok(visibleApplications);
    }
}
