using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetCruiseApplicationsForCruise;


public record GetCruiseApplicationsForCruiseQuery : IRequest<Result<List<CruiseApplicationDto>>>;