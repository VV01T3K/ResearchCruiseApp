using DomainCruise = ResearchCruiseApp.Domain.Entities.Cruise;

namespace ResearchCruiseApp.Api.Cruises;

public sealed record BlockadeResponse(DateTime StartDate, DateTime EndDate, string Title)
{
    public static BlockadeResponse From(DomainCruise cruise)
    {
        return new BlockadeResponse(
            DateTime.Parse(cruise.StartDate),
            DateTime.Parse(cruise.EndDate),
            cruise.Title ?? string.Empty
        );
    }
}
