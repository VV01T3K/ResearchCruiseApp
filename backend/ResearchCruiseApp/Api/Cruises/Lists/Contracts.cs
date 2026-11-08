using System.Globalization;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
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
    CruiseStatus Status,
    string? Title,
    bool ShipUnavailable,
    string Revision
)
{
    internal static async Task<CruiseResponse> From(
        DomainCruise cruise,
        IReadOnlyDictionary<Guid, CruiseManagerOptionDto> managers,
        ApplicationScoringService evaluator,
        UserPermissionVerifier userPermissionVerifier
    )
    {
        var applications = new List<ApplicationSummaryResponse>();
        foreach (var application in cruise.CruiseApplications)
        {
            if (await userPermissionVerifier.CanCurrentUserViewCruiseApplication(application))
            {
                applications.Add(
                    new ApplicationSummaryResponse(
                        application.Id,
                        application.FormA?.CruiseManagerId ?? Guid.Empty,
                        application.FormA?.DeputyManagerId ?? Guid.Empty,
                        application.Number.ToString(CultureInfo.InvariantCulture),
                        evaluator.GetPointsSum(application).ToString(CultureInfo.InvariantCulture)
                    )
                );
            }
        }
        var manager = managers.GetValueOrDefault(cruise.MainCruiseManagerId);
        var deputy = managers.GetValueOrDefault(cruise.MainDeputyManagerId);

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
            applications,
            cruise.Status,
            cruise.Title,
            cruise.ShipUnavailable,
            cruise.RowVersion.ToRevision()
        );
    }

    internal static Task<Dictionary<Guid, CruiseManagerOptionDto>> LoadManagers(
        IEnumerable<DomainCruise> cruises,
        UserManager<User> userManager,
        CancellationToken cancellationToken
    ) =>
        userManager.GetCruiseManagerOptionsByIds(
            cruises.SelectMany(cruise =>
                new[] { cruise.MainCruiseManagerId, cruise.MainDeputyManagerId }
            ),
            cancellationToken
        );
}

public sealed record PersonResponse(Guid Id, string FirstName, string LastName);

public sealed record ApplicationSummaryResponse(
    Guid Id,
    Guid CruiseManagerId,
    Guid DeputyManagerId,
    string Number,
    string Points
);
