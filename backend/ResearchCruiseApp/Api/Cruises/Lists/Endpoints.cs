using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Api.Cruises.Shared;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Cruises;

public static class ListsEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapGetAll(group);
        MapGetById(group);
    }

    private static void MapGetAll(RouteGroupBuilder group)
    {
        group
            .MapGet("", GetAll)
            .WithName("GetCruises")
            .WithSummary("Get visible cruises.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status409Conflict)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static void MapGetById(RouteGroupBuilder group)
    {
        group
            .MapGet("/{cruiseId:guid}", GetById)
            .WithName("GetCruise")
            .WithSummary("Get one visible cruise.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status409Conflict)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Results<Ok<List<CruiseResponse>>, ProblemHttpResult>> GetAll(
        IdentityService identityService,
        ApplicationScoringService evaluator,
        ApplicationDbContext dbContext,
        UserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var query = dbContext
            .Cruises.AsSplitQuery()
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.Permissions)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormAResearchTasks)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormAContracts)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormAUgUnits)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormAGuestUnits)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormAPublications)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormASpubTasks);
        var read = await dbContext.ReadOneRevision(
            () => query.ToListAsync(cancellationToken),
            async cruises =>
                !cruises
                    .Select(cruise => cruise.RowVersion.ToRevision())
                    .ToHashSet()
                    .SetEquals(
                        (
                            await dbContext
                                .Cruises.Select(cruise => cruise.RowVersion)
                                .ToListAsync(cancellationToken)
                        ).Select(rowVersion => rowVersion.ToRevision())
                    )
        );
        if (!read.IsSuccess)
            return read.Error!.ToProblemHttpResult();

        var visibleCruises = new List<CruiseResponse>();
        foreach (var cruise in read.Data!)
        {
            if (await userPermissionVerifier.CanCurrentUserViewCruise(cruise))
            {
                visibleCruises.Add(await CruiseResponse.From(cruise, identityService, evaluator));
            }
        }

        return TypedResults.Ok(visibleCruises);
    }

    private static async Task<Results<Ok<CruiseResponse>, NotFound, ProblemHttpResult>> GetById(
        Guid cruiseId,
        IdentityService identityService,
        ApplicationScoringService evaluator,
        ApplicationDbContext dbContext,
        UserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var query = dbContext
            .Cruises.AsSplitQuery()
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.Permissions)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormAResearchTasks)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormAContracts)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormAUgUnits)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormAGuestUnits)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormAPublications)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormASpubTasks);
        var read = await dbContext.ReadOneRevision(
            () => query.SingleOrDefaultAsync(cruise => cruise.Id == cruiseId, cancellationToken),
            async cruise =>
                cruise is not null
                && !cruise.RowVersion.Matches(
                    (
                        await dbContext
                            .Cruises.Where(current => current.Id == cruiseId)
                            .Select(current => current.RowVersion)
                            .SingleOrDefaultAsync(cancellationToken)
                    )?.ToRevision()
                )
        );
        if (!read.IsSuccess)
            return read.Error!.ToProblemHttpResult();

        var cruise = read.Data;
        if (cruise is null || !await userPermissionVerifier.CanCurrentUserViewCruise(cruise))
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(await CruiseResponse.From(cruise, identityService, evaluator));
    }
}
