using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Users;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetCruiseApplicationManagers;

public record GetCruiseApplicationManagersQuery : IRequest<Result<List<CruiseManagerOptionDto>>>;
