namespace ResearchCruiseApp.Api.Cruises;

public sealed record CreateRequest(
    string StartDate,
    string EndDate,
    Guid MainManagerId,
    Guid DeputyManagerId,
    List<Guid> CruiseApplicationIds,
    string? Title,
    bool ShipUnavailable
);

public sealed record UpdateRequest(
    string StartDate,
    string EndDate,
    Guid MainManagerId,
    Guid DeputyManagerId,
    List<Guid> CruiseApplicationIds,
    string? Title,
    bool ShipUnavailable
);
