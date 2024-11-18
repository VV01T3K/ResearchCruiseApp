using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.Models.Common.Commands.CruiseApplications;


public abstract record FormACommand(FormADto FormADto, bool IsDraft);