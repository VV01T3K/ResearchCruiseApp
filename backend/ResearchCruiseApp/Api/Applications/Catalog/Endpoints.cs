using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications;

public static class CatalogEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("", GetAll)
            .WithName("GetApplications")
            .WithSummary("Get visible applications.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);

        group
            .MapGet("/{applicationId:guid}", Get)
            .WithName("GetApplication")
            .WithSummary("Get one visible application.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Ok<ApplicationsPageResponse>> GetAll(
        string? cursor,
        int pageSize,
        ApplicationReader projection,
        ApplicationDbContext dbContext,
        UserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var hasCursor = CruiseApplicationsCursor.TryDecode(cursor, out var cursorNumber, out var cursorId);
        var clampedPageSize = Math.Clamp(pageSize, 1, 100);

        var query = dbContext
            .CruiseApplications.IncludeForms()
            .IncludeFormAContent()
            .IncludeEffects()
            .IncludeCruise();

        if (hasCursor)
        {
            query = query.Where(a =>
                a.Number < cursorNumber
                || (a.Number == cursorNumber && a.Id.CompareTo(cursorId) < 0)
            );
        }

        var applications = await query
            .OrderByDescending(a => a.Number)
            .ThenByDescending(a => a.Id)
            .Take(clampedPageSize)
            .ToListAsync(cancellationToken);

        var visibleApplications = new List<ApplicationResponse>();
        foreach (var application in applications)
        {
            if (await userPermissionVerifier.CanCurrentUserViewCruiseApplication(application))
            {
                visibleApplications.Add(
                    ApplicationResponse.From(await projection.Create(application))
                );
            }
        }

        // The cursor advances over every DB row examined (not just those that survived the
        // permission filter), so a page can come back smaller than pageSize without skipping rows.
        var nextCursor = applications.Count == clampedPageSize
            ? CruiseApplicationsCursor.Encode(applications[^1].Number, applications[^1].Id)
            : null;

        return TypedResults.Ok(new ApplicationsPageResponse(visibleApplications, nextCursor));
    }

    private static async Task<Results<Ok<ApplicationResponse>, NotFound>> Get(
        Guid applicationId,
        ApplicationReader applications,
        ApplicationDbContext dbContext,
        UserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var application = await dbContext
            .CruiseApplications.IncludeForms()
            .IncludeFormAContent()
            .IncludeCruise()
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

        return TypedResults.Ok(ApplicationResponse.From(await applications.Create(application)));
    }
}
