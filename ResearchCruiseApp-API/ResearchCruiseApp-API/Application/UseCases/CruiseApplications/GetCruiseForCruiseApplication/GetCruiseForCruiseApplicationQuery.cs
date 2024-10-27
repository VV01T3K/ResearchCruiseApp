using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetCruiseForCruiseApplication;


public record GetCruiseForCruiseApplicationQuery(Guid CruiseApplicationId) : IRequest<Result<CruiseDto>>;