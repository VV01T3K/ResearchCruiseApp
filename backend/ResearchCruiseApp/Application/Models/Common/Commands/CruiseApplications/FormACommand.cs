using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.Models.Common.Commands.CruiseApplications;

public abstract record FormACommand(FormADto FormADto, bool IsDraft);
