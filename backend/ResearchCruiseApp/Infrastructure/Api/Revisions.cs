using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Infrastructure.Api;

public sealed record RevisionResponse(string Revision);

public static class Revisions
{
    public const string StaleMessage =
        "Dane zostały w międzyczasie zmienione w innym oknie lub przez inną osobę, więc nie zapisano zmian. Wprowadzone wartości pozostają na stronie. Odśwież ją, aby wczytać aktualną wersję.";

    public static string ToRevision(this byte[] rowVersion) => Convert.ToBase64String(rowVersion);

    public static bool Matches(this byte[] rowVersion, string? revision) =>
        revision == rowVersion.ToRevision();

    public static ProblemHttpResult StaleRevision() =>
        Error.Conflict(StaleMessage).ToProblemHttpResult();
}
