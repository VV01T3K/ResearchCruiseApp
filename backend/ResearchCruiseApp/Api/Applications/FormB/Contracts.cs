using ResearchCruiseApp.ApplicationForms.Payloads;

namespace ResearchCruiseApp.Api.Applications;

public sealed record FormBWriteRequest(FormBDto Form, bool Draft);
