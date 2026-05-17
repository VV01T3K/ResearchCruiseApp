using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.Models.Common.Validation.CruiseApplications;

public sealed record FormAValidationModel(FormADto FormADto, bool IsDraft);
