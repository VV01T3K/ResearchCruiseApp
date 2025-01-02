using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Users;

namespace ResearchCruiseApp.Application.UseCases.Users.ToggleUserRole;


public record ToggleUserRoleCommand(Guid UserId, UserRoleToggleDto RoleToggleDto) : IRequest<Result>;