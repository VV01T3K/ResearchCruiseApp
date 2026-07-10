using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Applications;

public sealed record FormCWriteRequest(FormCDto Form, bool Draft);
