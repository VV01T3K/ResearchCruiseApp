using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Users;

public static class AssignmentsEndpoints
{
    private static readonly CruiseApplicationStatus[] ClosedApplicationStatuses =
    [
        CruiseApplicationStatus.DeniedBySupervisor,
        CruiseApplicationStatus.Denied,
        CruiseApplicationStatus.Reported,
    ];

    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/{userId:guid}/assignments", Get)
            .WithName("GetUserAssignments")
            .WithSummary(
                "Get the applications and cruises a managed user leads or deputizes, before their role or account changes."
            )
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<Ok<UserAssignmentsResponse>, ProblemHttpResult>> Get(
        Guid userId,
        UserPermissionVerifier userPermissionVerifier,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        if (!await userPermissionVerifier.CanCurrentUserAccess(userId))
        {
            return Error
                .ForbiddenOperation("Nie można edytować tego użytkownika")
                .ToProblemHttpResult();
        }

        var applications = await dbContext
            .CruiseApplications.Where(application =>
                application.FormA != null
                && (
                    application.FormA.CruiseManagerId == userId
                    || application.FormA.DeputyManagerId == userId
                )
            )
            .OrderBy(application => application.Number)
            .Select(application => new
            {
                application.Id,
                application.Number,
                IsDeputy = application.FormA!.CruiseManagerId != userId,
                application.Status,
            })
            .ToListAsync(cancellationToken);
        var cruises = await dbContext
            .Cruises.Where(cruise =>
                cruise.MainCruiseManagerId == userId || cruise.MainDeputyManagerId == userId
            )
            .OrderBy(cruise => cruise.StartDate)
            .Select(cruise => new
            {
                cruise.Id,
                cruise.Number,
                IsDeputy = cruise.MainCruiseManagerId != userId,
                cruise.Status,
            })
            .ToListAsync(cancellationToken);

        var activeApplications = applications
            .Where(application => !ClosedApplicationStatuses.Contains(application.Status))
            .Select(application => new AssignedApplicationResponse(
                application.Id,
                application.Number.ToString(),
                application.IsDeputy,
                application.Status
            ))
            .ToList();
        var activeCruises = cruises
            .Where(cruise => cruise.Status != CruiseStatus.Ended)
            .Select(cruise => new AssignedCruiseResponse(
                cruise.Id,
                cruise.Number,
                cruise.IsDeputy,
                cruise.Status
            ))
            .ToList();
        var closedCount =
            applications.Count + cruises.Count - activeApplications.Count - activeCruises.Count;

        return TypedResults.Ok(
            new UserAssignmentsResponse(activeApplications, activeCruises, closedCount)
        );
    }
}
