using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Applications;

public sealed record SupervisorReviewResponse(FormADto Form, FormAInitValuesDto InitValues);

public sealed record SupervisorDecisionRequest(bool Accept, string Code);
