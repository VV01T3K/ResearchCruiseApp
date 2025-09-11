using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;

namespace ResearchCruiseApp.Application.UseCases.Cruises.GetBlockades;

public record GetBlockadesQuery(int Year) : IRequest<Result<List<CruiseBlockadePeriodDto>>>;
