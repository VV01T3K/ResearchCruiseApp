using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;

namespace ResearchCruiseApp.Application.UseCases.Cruises.GetAllCruises;

public record GetAllCruisesQuery : IRequest<Result<List<CruiseDto>>>;
