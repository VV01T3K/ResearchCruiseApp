using ResearchCruiseApp.Api.Applications.Contracts;

namespace ResearchCruiseApp.Api.Applications.Validation;

public sealed record FormCValidationModel(FormCDto FormCDto, bool IsDraft);
