using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Persistence;

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

    // Split queries run outside a transaction, so reread when a save lands between them.
    internal static async Task<T> ReadOneRevision<T>(
        this ApplicationDbContext dbContext,
        Func<Task<T>> read,
        Func<T, Task<bool>> changed
    )
    {
        for (var attempt = 1; ; attempt++)
        {
            var result = await read();
            if (attempt == 3 || !await changed(result))
                return result;
            dbContext.ChangeTracker.Clear();
        }
    }
}
