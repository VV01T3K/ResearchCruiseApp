using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;

namespace ResearchCruiseApp.Application.UseCases.Cruises.AddCruise;

public record AddCruiseCommand(CruiseFormDto CruiseFormDto) : IRequest<Result>;
