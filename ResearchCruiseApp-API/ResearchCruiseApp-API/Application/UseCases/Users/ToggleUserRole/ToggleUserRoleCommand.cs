using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Users;

namespace ResearchCruiseApp_API.Application.UseCases.Users.ToggleUserRole;


public record ToggleUserRoleCommand(Guid UserId, UserRoleToggleDto RoleToggleDto) : IRequest<Result>;