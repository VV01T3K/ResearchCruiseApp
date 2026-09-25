using System.Text.Json.Serialization;
using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Applications;

public sealed record SupervisorReviewResponse(FormAFields Form, FormAOptions InitValues);

public sealed record SupervisorDecisionRequest(
    [property: JsonRequired] bool Accept,
    [property: JsonRequired] string Code
);
