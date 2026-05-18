using ResearchCruiseApp.Api.Applications.Contracts;

namespace ResearchCruiseApp.Api.Applications.Validation;

public sealed record FormAValidationModel(FormADto FormADto, bool IsDraft);
