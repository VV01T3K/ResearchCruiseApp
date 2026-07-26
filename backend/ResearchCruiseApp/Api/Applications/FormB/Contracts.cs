using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Applications;

public sealed record FormBWriteRequest
{
    public required FormBFields Form { get; init; }
    public required bool Draft { get; init; }
}
