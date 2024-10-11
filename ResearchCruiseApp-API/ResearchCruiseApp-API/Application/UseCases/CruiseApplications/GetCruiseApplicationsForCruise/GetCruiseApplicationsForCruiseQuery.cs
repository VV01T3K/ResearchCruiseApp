using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetCruiseApplicationsForCruise;


public record GetCruiseApplicationsForCruiseQuery : IRequest<Result<List<CruiseApplicationDto>>>;