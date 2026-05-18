using ResearchCruiseApp.ApplicationForms.Payloads;

namespace ResearchCruiseApp.ApplicationForms.Validation;

public sealed record FormCValidationModel(FormCDto FormCDto, bool IsDraft);
