using ResearchCruiseApp.ApplicationForms.Payloads;

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
    int Year,
    ApplicationPersonResponse MainManager,
    ApplicationPersonResponse DeputyManager,
    bool HasFormA,
    bool HasFormB,
    bool HasFormC,
    int Points,
    string Status,
    string EffectsDoneRate,
    string? Note,
    string? CruiseHours,
    float? CruiseDays,
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
    public static ApplicationResponse From(CruiseApplicationDto application)
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
