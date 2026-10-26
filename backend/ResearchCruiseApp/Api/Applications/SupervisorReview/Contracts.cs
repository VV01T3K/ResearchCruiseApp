using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Applications;

public sealed record SupervisorReviewResponse(
    string Number,
    FormAFields Form,
    FormAOptions InitValues
);

public sealed record SupervisorDecisionRequest(bool Accept, string Code);
