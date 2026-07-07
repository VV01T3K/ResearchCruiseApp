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
            .WithName("GetCruisesV2")
            .WithSummary("Get visible cruises.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static void MapGetById(RouteGroupBuilder group)
    {
        group
            .MapGet("/{cruiseId:guid}", GetById)
            .WithName("GetCruiseV2")
            .WithSummary("Get one visible cruise.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Ok<List<CruiseResponse>>> GetAll(
        IIdentityService identityService,
        ApplicationScoringService evaluator,
        ApplicationDbContext dbContext,
        IUserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var cruises = await dbContext
            .Cruises.IncludeCruiseApplications()
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
                .ThenInclude(application => application.FormA!.FormASpubTasks)
            .ToListAsync(cancellationToken);

        var visibleCruises = new List<CruiseResponse>();
        foreach (var cruise in cruises)
        {
            if (await userPermissionVerifier.CanCurrentUserViewCruise(cruise))
            {
                visibleCruises.Add(await CruiseResponse.From(cruise, identityService, evaluator));
            }
        }

        return TypedResults.Ok(visibleCruises);
    }

    private static async Task<Results<Ok<CruiseResponse>, NotFound>> GetById(
        Guid cruiseId,
        IIdentityService identityService,
        ApplicationScoringService evaluator,
        ApplicationDbContext dbContext,
        IUserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var cruise = await dbContext
            .Cruises.IncludeCruiseApplications()
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
                .ThenInclude(application => application.FormA!.FormASpubTasks)
            .SingleOrDefaultAsync(cruise => cruise.Id == cruiseId, cancellationToken);
        if (cruise is null || !await userPermissionVerifier.CanCurrentUserViewCruise(cruise))
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(await CruiseResponse.From(cruise, identityService, evaluator));
    }
}
