using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Applications;

public sealed record FormAWriteRequest(FormADto Form, bool Draft);
