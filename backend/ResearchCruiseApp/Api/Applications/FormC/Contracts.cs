using ResearchCruiseApp.ApplicationForms.Payloads;

namespace ResearchCruiseApp.Api.Applications;

public sealed record FormCWriteRequest(FormCDto Form, bool Draft);
