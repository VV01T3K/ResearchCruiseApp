using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.EditCruise;


public record EditCruiseCommand(Guid Id, CruiseFormDto CruiseFormModel) : IRequest<Result>;