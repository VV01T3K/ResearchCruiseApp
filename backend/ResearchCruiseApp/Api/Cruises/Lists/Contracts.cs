using ResearchCruiseApp.Api.Applications.Shared;
using DomainCruise = ResearchCruiseApp.Domain.Entities.Cruise;

namespace ResearchCruiseApp.Api.Cruises;

public sealed record CruiseResponse(
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
    internal static async Task<CruiseResponse> From(
        DomainCruise cruise,
        IIdentityService identityService,
        ApplicationScoringService evaluator
    )
    {
        var manager = await identityService.GetUserDtoById(cruise.MainCruiseManagerId);
        var deputy = await identityService.GetUserDtoById(cruise.MainDeputyManagerId);

        return new CruiseResponse(
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
