using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Applications;

public sealed record FormBWriteRequest(FormBDto Form, bool Draft);
