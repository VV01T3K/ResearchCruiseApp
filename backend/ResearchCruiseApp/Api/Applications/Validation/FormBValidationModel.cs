using ResearchCruiseApp.Api.Applications.Contracts;

namespace ResearchCruiseApp.Api.Applications.Validation;

public sealed record FormBValidationModel(FormBDto FormBDto, bool IsDraft);
