using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResponse;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.DTOs;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetAllCruiseApplications;


public record GetAllCruiseApplicationsQuery : IRequest<Result<List<CruiseApplicationDto>>>;