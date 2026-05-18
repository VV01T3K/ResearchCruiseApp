using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Workflows;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Domain.Logic;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;

namespace ResearchCruiseApp.Api.Cruises;

public static class Lists
{
    public static void Map(RouteGroupBuilder group)
    {
        GetAll.Map(group);
        GetOne.Map(group);
    }

    public static class GetAll
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapGet("", Handle)
                .WithName("GetCruisesV2")
                .WithSummary("Get visible cruises.")
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
        }

        private static async Task<Ok<List<Response>>> Handle(
            IIdentityService identityService,
            ICruiseApplicationEvaluator evaluator,
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

            var visibleCruises = new List<Response>();
            foreach (var cruise in cruises)
            {
                if (await userPermissionVerifier.CanCurrentUserViewCruise(cruise))
                {
                    visibleCruises.Add(await Response.From(cruise, identityService, evaluator));
                }
            }

            return TypedResults.Ok(visibleCruises);
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

    public static class GetOne
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapGet("/{cruiseId:guid}", Handle)
                .WithName("GetCruiseV2")
                .WithSummary("Get one visible cruise.")
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status404NotFound)
                .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
        }

        private static async Task<Results<Ok<Response>, NotFound>> Handle(
            Guid cruiseId,
            IIdentityService identityService,
            ICruiseApplicationEvaluator evaluator,
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

            return TypedResults.Ok(await Response.From(cruise, identityService, evaluator));
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
}
