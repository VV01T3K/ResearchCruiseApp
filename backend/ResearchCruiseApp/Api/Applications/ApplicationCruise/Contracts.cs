using ResearchCruiseApp.Api;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain.Common.Extensions;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications;

public sealed record ApplicationCruiseResponse(
    Guid Id,
    string Number,
    string StartDate,
    string EndDate,
    ApplicationCruisePersonResponse MainManager,
    ApplicationCruisePersonResponse DeputyManager,
    List<ApplicationCruiseApplicationSummaryResponse> Applications,
    string Status,
    string? Title,
    bool ShipUnavailable
)
{
    internal static async Task<ApplicationCruiseResponse> From(
        Cruise cruise,
        IIdentityService identityService,
        ApplicationScoringService evaluator
    )
    {
        var manager = await identityService.GetUserDtoById(cruise.MainCruiseManagerId);
        var deputy = await identityService.GetUserDtoById(cruise.MainDeputyManagerId);

        return new ApplicationCruiseResponse(
            cruise.Id,
            cruise.Number,
            cruise.StartDate,
            cruise.EndDate,
            new ApplicationCruisePersonResponse(
                cruise.MainCruiseManagerId,
                manager?.FirstName ?? string.Empty,
                manager?.LastName ?? string.Empty
            ),
            new ApplicationCruisePersonResponse(
                cruise.MainDeputyManagerId,
                deputy?.FirstName ?? string.Empty,
                deputy?.LastName ?? string.Empty
            ),
            cruise
                .CruiseApplications.Select(
                    application => new ApplicationCruiseApplicationSummaryResponse(
                        application.Id,
                        application.FormA?.CruiseManagerId ?? Guid.Empty,
                        application.FormA?.DeputyManagerId ?? Guid.Empty,
                        application.Number.ToString(),
                        evaluator.GetPointsSum(application).ToString()
                    )
                )
                .ToList(),
            cruise.Status.ToCode(),
            cruise.Title,
            cruise.ShipUnavailable
        );
    }
}

public sealed record ApplicationCruisePersonResponse(Guid Id, string FirstName, string LastName);

public sealed record ApplicationCruiseApplicationSummaryResponse(
    Guid Id,
    Guid CruiseManagerId,
    Guid DeputyManagerId,
    string Number,
    string Points
);
