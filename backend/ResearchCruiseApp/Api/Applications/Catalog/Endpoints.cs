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
        var hasCursor = CruiseApplicationsCursor.TryDecode(
            cursor,
            sortBy,
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

        var query = dbContext
            .CruiseApplications.Where(await userPermissionVerifier.GetApplicationVisibilityFilter())
            .IncludeForms()
            .IncludeFormAContent()
            .IncludeEffects()
            .IncludeCruise()
            .ApplyFilter(filter);

        query = sortBy switch
        {
            "date" => query.ApplyDateSort(
                hasCursor ? cursorSortValue : null,
                hasCursor ? cursorId : (Guid?)null,
                descending
            ),
            "year" => query.ApplyYearSort(
                hasCursor ? cursorSortValue : null,
                hasCursor ? cursorId : (Guid?)null,
                descending
            ),
            _ => query.ApplyNumberSort(
                hasCursor ? cursorSortValue : null,
                hasCursor ? cursorId : (Guid?)null,
                descending
            ),
        };

        var applications = await query.Take(clampedPageSize + 1).ToListAsync(cancellationToken);
        var hasMore = applications.Count > clampedPageSize;
        if (hasMore)
            applications.RemoveAt(clampedPageSize);

        var visibleApplications = new List<ApplicationResponse>();
        foreach (var application in applications)
        {
            visibleApplications.Add(ApplicationResponse.From(await projection.Create(application)));
        }

        var nextCursor = hasMore
            ? CruiseApplicationsCursor.Encode(
                GetSortValue(applications[^1], sortBy),
                applications[^1].Id
            )
            : null;

        return TypedResults.Ok(new ApplicationsPageResponse(visibleApplications, nextCursor));
    }

    private static string GetSortValue(CruiseApplication application, string sortBy) =>
        sortBy switch
        {
            "date" => application.Date.ToString("yyyy-MM-dd"),
            "year" => application.FormA!.Year,
            _ => application.Number.ToString(),
        };

    private static async Task<Ok<List<ApplicationPersonResponse>>> GetManagers(
        ApplicationDbContext dbContext,
        UserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        // GUID text casing differs by database provider. SQL LOWER is translatable and
        // culture independent for hexadecimal IDs; ToLowerInvariant is not translated.
#pragma warning disable CA1304, CA1311
        var managerIds = dbContext
            .CruiseApplications.Where(await userPermissionVerifier.GetApplicationVisibilityFilter())
            .Where(a => a.FormA != null)
            .Select(a => a.FormA!.CruiseManagerId.ToString().ToLower());
        var managers = await dbContext
            .Users.Where(u => managerIds.Contains(u.Id.ToLower()))
            .OrderBy(u => u.LastName)
            .ThenBy(u => u.FirstName)
            .ThenBy(u => u.Id)
            .Select(u => new ApplicationPersonResponse(
                Guid.Parse(u.Id),
                u.Email ?? string.Empty,
                u.FirstName,
                u.LastName
            ))
            .ToListAsync(cancellationToken);
#pragma warning restore CA1304, CA1311

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
