using System.Globalization;
using System.Text.Json.Serialization;
using ResearchCruiseApp.Domain.Entities;
using DomainCruise = ResearchCruiseApp.Domain.Entities.Cruise;

namespace ResearchCruiseApp.Api.Cruises;

public sealed record BlockadeResponse(DateTime StartDate, DateTime EndDate, string Title)
{
    public static BlockadeResponse From(DomainCruise cruise)
    {
        return new BlockadeResponse(
            DateTime.Parse(cruise.StartDate, CultureInfo.InvariantCulture),
            DateTime.Parse(cruise.EndDate, CultureInfo.InvariantCulture),
            cruise.Title ?? string.Empty
        );
    }
}

public sealed record AutoPlanResponse(
    [property: JsonNumberHandling(JsonNumberHandling.Strict)] int PlannedCount,
    List<SkippedApplicationResponse> Skipped
);

public sealed record SkippedApplicationResponse(
    Guid ApplicationId,
    string ApplicationNumber,
    string Reason
)
{
    public static SkippedApplicationResponse From(CruiseApplication application, string reason) =>
        new(application.Id, application.Number.ToString(CultureInfo.InvariantCulture), reason);
}
