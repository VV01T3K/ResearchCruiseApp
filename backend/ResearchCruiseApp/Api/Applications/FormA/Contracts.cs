using ResearchCruiseApp.ApplicationForms.Payloads;

namespace ResearchCruiseApp.Api.Applications;

public sealed record FormAWriteRequest(FormADto Form, bool Draft);
