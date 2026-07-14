using System.Text.Json.Serialization;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Api.Applications;

public sealed record ApplicationPersonResponse(
    Guid Id,
    string Email,
    string FirstName,
    string LastName
);

public sealed record ApplicationResponse(
    Guid Id,
    string Number,
    DateOnly Date,
    [property: JsonNumberHandling(JsonNumberHandling.Strict)] int Year,
    ApplicationPersonResponse MainManager,
    ApplicationPersonResponse DeputyManager,
    bool HasFormA,
    bool HasFormB,
    bool HasFormC,
    [property: JsonNumberHandling(JsonNumberHandling.Strict)] int Points,
    CruiseApplicationStatus Status,
    string EffectsDoneRate,
    string? Note,
    string? CruiseHours,
    [property: JsonNumberHandling(JsonNumberHandling.Strict)] float? CruiseDays,
    string? AcceptablePeriodBeg,
    string? AcceptablePeriodEnd,
    string? OptimalPeriodBeg,
    string? OptimalPeriodEnd,
    DateTime? PrecisePeriodStart,
    DateTime? PrecisePeriodEnd,
    DateTime? StartDate,
    DateTime? EndDate
)
{
    public static ApplicationResponse From(CruiseApplicationSummary application)
    {
        return new ApplicationResponse(
            application.Id,
            application.Number,
            application.Date,
            application.Year,
            new ApplicationPersonResponse(
                application.CruiseManagerId,
                application.CruiseManagerEmail,
                application.CruiseManagerFirstName,
                application.CruiseManagerLastName
            ),
            new ApplicationPersonResponse(
                application.DeputyManagerId,
                application.DeputyManagerEmail,
                application.DeputyManagerFirstName,
                application.DeputyManagerLastName
            ),
            application.HasFormA,
            application.HasFormB,
            application.HasFormC,
            application.Points,
            application.Status,
            application.EffectsDoneRate,
            application.Note,
            application.CruiseHours,
            application.CruiseDays,
            application.AcceptablePeriodBeg,
            application.AcceptablePeriodEnd,
            application.OptimalPeriodBeg,
            application.OptimalPeriodEnd,
            application.PrecisePeriodStart,
            application.PrecisePeriodEnd,
            application.StartDate,
            application.EndDate
        );
    }
}
