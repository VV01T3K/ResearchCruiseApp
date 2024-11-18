using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.GetCruise;


public record GetCruiseQuery(Guid Id) : IRequest<Result<CruiseDto>>;