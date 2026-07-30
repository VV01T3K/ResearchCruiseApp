using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain;
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
        List<int>? numbers,
        List<DateOnly>? dates,
        List<string>? statuses,
        List<int>? years,
        List<string>? cruiseManagers,
        ApplicationReader projection,
        ApplicationDbContext dbContext,
        UserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken,
        int pageSize = 20,
        string sortBy = "number",
        bool descending = true
    )
    {
        var hasCursor = CruiseApplicationsCursor.TryDecode(cursor, out var cursorSortValue, out var cursorId);
        var clampedPageSize = Math.Clamp(pageSize, 1, 100);

        var parsedStatuses = statuses?
            .Select(s => Enum.TryParse<CruiseApplicationStatus>(s, ignoreCase: true, out var parsed)
                ? parsed
                : (CruiseApplicationStatus?)null)
            .Where(s => s.HasValue)
            .Select(s => s!.Value)
            .ToList();

        var filter = new CruiseApplicationsFilter(numbers, dates, parsedStatuses, years, cruiseManagers);

        var query = dbContext
            .CruiseApplications.IncludeForms()
            .IncludeFormAContent()
            .IncludeEffects()
            .IncludeCruise()
            .ApplyFilter(filter, dbContext.Users);

        query = sortBy switch
        {
            "date" => query.ApplyDateSort(hasCursor ? cursorSortValue : null, hasCursor ? cursorId : (Guid?)null, descending),
            "year" => query.ApplyYearSort(hasCursor ? cursorSortValue : null, hasCursor ? cursorId : (Guid?)null, descending),
            _ => query.ApplyNumberSort(hasCursor ? cursorSortValue : null, hasCursor ? cursorId : (Guid?)null, descending),
        };

        var applications = await query
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
            ? CruiseApplicationsCursor.Encode(GetSortValue(applications[^1], sortBy), applications[^1].Id)
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
        var applications = await dbContext
            .CruiseApplications.IncludeFormA()
            .Where(a => a.FormA != null)
            .ToListAsync(cancellationToken);

        var visibleManagerIds = new HashSet<Guid>();
        foreach (var application in applications)
        {
            if (await userPermissionVerifier.CanCurrentUserViewCruiseApplication(application))
                visibleManagerIds.Add(application.FormA!.CruiseManagerId);
        }

        var managerIdStrings = visibleManagerIds.Select(id => id.ToString()).ToList();
        var managers = await dbContext.Users
            .Where(u => managerIdStrings.Contains(u.Id))
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
