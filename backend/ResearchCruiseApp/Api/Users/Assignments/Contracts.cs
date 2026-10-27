using System.Text.Json.Serialization;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Api.Users;

public sealed record UserAssignmentsResponse(
    List<AssignedApplicationResponse> Applications,
    List<AssignedCruiseResponse> Cruises,
    [property: JsonNumberHandling(JsonNumberHandling.Strict)] int ClosedCount
);

public sealed record AssignedApplicationResponse(
    Guid Id,
    string Number,
    bool IsDeputy,
    CruiseApplicationStatus Status
);

public sealed record AssignedCruiseResponse(
    Guid Id,
    string Number,
    bool IsDeputy,
    CruiseStatus Status
);
