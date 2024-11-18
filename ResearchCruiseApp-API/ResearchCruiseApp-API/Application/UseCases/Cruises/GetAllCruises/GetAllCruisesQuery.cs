using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.GetAllCruises;


public record GetAllCruisesQuery : IRequest<Result<List<CruiseDto>>>;