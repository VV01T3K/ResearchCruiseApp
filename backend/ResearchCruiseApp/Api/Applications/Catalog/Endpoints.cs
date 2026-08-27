using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
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
            .MapGet("/managers", GetManagers)
            .WithName("GetApplicationManagers")
            .WithSummary("Get managers of applications visible to the current user.")
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
        int[]? number,
        DateOnly[]? date,
        string[]? status,
        int[]? year,
        Guid[]? cruiseManager,
        ApplicationReader projection,
        ApplicationDbContext dbContext,
        UserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken,
        int? pageSize = null,
        string sortBy = "number",
        bool descending = true
    )
    {
        var sortField = CruiseApplicationsSorting.Parse(sortBy);
        var hasCursor = CruiseApplicationsCursor.TryDecode(
            cursor,
            sortField,
            out var cursorSortValue,
            out var cursorId
        );
        var clampedPageSize = Math.Clamp(pageSize ?? 20, 1, 100);

        var parsedStatuses = status
            ?.Select(s =>
                Enum.TryParse<CruiseApplicationStatus>(s, ignoreCase: true, out var parsed)
                    ? parsed
                    : (CruiseApplicationStatus?)null
            )
            .Where(s => s.HasValue)
            .Select(s => s!.Value)
            .ToList();

        var filter = new CruiseApplicationsFilter(
            number?.ToList(),
            date?.ToList(),
            parsedStatuses,
            year?.ToList(),
            cruiseManager?.ToList()
        );

        var visibleApplications = await userPermissionVerifier.FilterVisibleCruiseApplications(
            dbContext.CruiseApplications
        );
        var query = visibleApplications
            .IncludeForms()
            .IncludeFormAContent()
            .IncludeEffects()
            .IncludeCruise()
            .ApplyFilter(filter);

        query = CruiseApplicationsSorting.Apply(
            query,
            sortField,
            hasCursor ? cursorSortValue : null,
            hasCursor ? cursorId : null,
            descending
        );

        var applications = await query.Take(clampedPageSize).ToListAsync(cancellationToken);

        var responses = new List<ApplicationResponse>();
        foreach (var application in applications)
        {
            responses.Add(ApplicationResponse.From(await projection.Create(application)));
        }

        var nextCursor =
            applications.Count == clampedPageSize
                ? CruiseApplicationsCursor.Encode(
                    CruiseApplicationsSorting.GetValue(applications[^1], sortField),
                    applications[^1].Id
                )
                : null;

        return TypedResults.Ok(new ApplicationsPageResponse(responses, nextCursor));
    }

    private static async Task<Ok<List<ApplicationPersonResponse>>> GetManagers(
        ApplicationDbContext dbContext,
        UserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var visibleApplications = await userPermissionVerifier.FilterVisibleCruiseApplications(
            dbContext.CruiseApplications
        );
        var visibleManagerIds = await visibleApplications
            .Where(a => a.FormA != null)
            .Select(a => a.FormA!.CruiseManagerId)
            .Distinct()
            .ToListAsync(cancellationToken);

        var managerIdStrings = visibleManagerIds.Select(id => id.ToString()).ToList();
        var managers = await dbContext
            .Users.Where(u => managerIdStrings.Contains(u.Id))
            .Select(u => new ApplicationPersonResponse(
                Guid.Parse(u.Id),
                u.Email ?? string.Empty,
                u.FirstName,
                u.LastName
            ))
            .ToListAsync(cancellationToken);

        return TypedResults.Ok(managers);
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
