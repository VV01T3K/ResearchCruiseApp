using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.Models.Common.Validation.CruiseApplications;

public sealed record FormBValidationModel(FormBDto FormBDto, bool IsDraft);
