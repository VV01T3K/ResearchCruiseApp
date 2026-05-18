using ResearchCruiseApp.ApplicationForms.Payloads;

namespace ResearchCruiseApp.ApplicationForms.Validation;

public sealed record FormBValidationModel(FormBDto FormBDto, bool IsDraft);
