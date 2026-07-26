using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Applications;

public sealed record FormAWriteRequest
{
    public required FormAFields Form { get; init; }
    public required bool Draft { get; init; }
}
