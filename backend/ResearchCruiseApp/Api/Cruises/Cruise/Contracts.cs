namespace ResearchCruiseApp.Api.Cruises;

public sealed record CreateRequest(
    string StartDate,
    string EndDate,
    Guid MainManagerId,
    Guid DeputyManagerId,
    List<Guid> CruiseApplicationIds,
    string? Title,
    bool ShipUnavailable
) : ICruiseRequest;

public sealed record UpdateRequest(
    string StartDate,
    string EndDate,
    Guid MainManagerId,
    Guid DeputyManagerId,
    List<Guid> CruiseApplicationIds,
    string? Title,
    bool ShipUnavailable,
    string? Revision
) : ICruiseRequest;

public interface ICruiseRequest
{
    string StartDate { get; }
    string EndDate { get; }
    string? Title { get; }
    bool ShipUnavailable { get; }
    List<Guid> CruiseApplicationIds { get; }
}
