using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;

namespace ResearchCruiseApp.Application.UseCases.Cruises.GetCruise;

public record GetCruiseQuery(Guid Id) : IRequest<Result<CruiseDto>>;
