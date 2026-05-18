using ResearchCruiseApp.ApplicationForms.Payloads;

namespace ResearchCruiseApp.ApplicationForms.Validation;

public sealed record FormAValidationModel(FormADto FormADto, bool IsDraft);
