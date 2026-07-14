using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Applications;

public sealed record SupervisorReviewResponse(FormAFields Form, FormAOptions InitValues);

public sealed record SupervisorDecisionRequest(bool Accept, string Code);
