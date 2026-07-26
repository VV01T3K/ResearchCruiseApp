using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Applications;

public sealed record FormCWriteRequest
{
    public required FormCFields Form { get; init; }
    public required bool Draft { get; init; }
}
