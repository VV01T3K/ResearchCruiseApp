using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Workflows;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Domain.Logic;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;

namespace ResearchCruiseApp.Api.Applications;

public static class ApplicationCruise
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/{applicationId:guid}/cruise", Get)
            .WithName("GetApplicationCruiseV2")
            .WithSummary("Get the visible cruise linked to an application.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Results<Ok<Response>, NotFound>> Get(
        Guid applicationId,
        ApplicationDbContext dbContext,
        IUserPermissionVerifier userPermissionVerifier,
        IIdentityService identityService,
        ICruiseApplicationEvaluator evaluator,
        CancellationToken cancellationToken
    )
    {
        var application = await dbContext
            .CruiseApplications.IncludeForms()
            .IncludeCruise()
            .SingleOrDefaultAsync(
                application => application.Id == applicationId,
                cancellationToken
            );
        if (
            application?.Cruise is null
            || !await userPermissionVerifier.CanCurrentUserViewForm(application)
        )
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(await Response.From(application.Cruise, identityService, evaluator));
    }

    public sealed record Response(
        Guid Id,
        string Number,
        string StartDate,
        string EndDate,
        PersonResponse MainManager,
        PersonResponse DeputyManager,
        List<ApplicationSummaryResponse> Applications,
        string Status,
        string? Title,
        bool ShipUnavailable
    )
    {
        internal static async Task<Response> From(
            Cruise cruise,
            IIdentityService identityService,
            ICruiseApplicationEvaluator evaluator
        )
        {
            var manager = await identityService.GetUserDtoById(cruise.MainCruiseManagerId);
            var deputy = await identityService.GetUserDtoById(cruise.MainDeputyManagerId);

            return new Response(
                cruise.Id,
                cruise.Number,
                cruise.StartDate,
                cruise.EndDate,
                new PersonResponse(
                    cruise.MainCruiseManagerId,
                    manager?.FirstName ?? string.Empty,
                    manager?.LastName ?? string.Empty
                ),
                new PersonResponse(
                    cruise.MainDeputyManagerId,
                    deputy?.FirstName ?? string.Empty,
                    deputy?.LastName ?? string.Empty
                ),
                cruise
                    .CruiseApplications.Select(application => new ApplicationSummaryResponse(
                        application.Id,
                        application.FormA?.CruiseManagerId ?? Guid.Empty,
                        application.FormA?.DeputyManagerId ?? Guid.Empty,
                        application.Number.ToString(),
                        evaluator.GetPointsSum(application).ToString()
                    ))
                    .ToList(),
                cruise.Status.ToCode(),
                cruise.Title,
                cruise.ShipUnavailable
            );
        }
    }

    public sealed record PersonResponse(Guid Id, string FirstName, string LastName);

    public sealed record ApplicationSummaryResponse(
        Guid Id,
        Guid CruiseManagerId,
        Guid DeputyManagerId,
        string Number,
        string Points
    );
}
