using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Users;

namespace ResearchCruiseApp.Application.UseCases.Users.GetAvailableCruiseManagers;

public record GetAvailableCruiseManagersQuery : IRequest<Result<List<CruiseManagerOptionDto>>>;
