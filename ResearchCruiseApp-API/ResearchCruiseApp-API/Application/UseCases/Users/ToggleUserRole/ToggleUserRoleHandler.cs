using MediatR;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.Users.ToggleUserRole;


public class ToggleUserRoleHandler(
    UserManager<User> userManager,
    IIdentityService identityService)
    : IRequestHandler<ToggleUserRoleCommand, Result>
{
    public async Task<Result> Handle(ToggleUserRoleCommand request, CancellationToken cancellationToken)
    {
        var user = await identityService.GetUserById(request.UserId);
        if (user is null)
            return Error.NotFound();

        var rolesNames = await identityService.GetAllRoleNames(cancellationToken);

        if (!rolesNames.Contains(request.RoleToggleDto.RoleName))
            return Error.BadRequest("Rola nie istnieje");

        var result = request.RoleToggleDto.AddRole
            ? await identityService.AddRoleToUser(user, request.RoleToggleDto.RoleName)
            : await identityService.RemoveRoleFromUser(user, request.RoleToggleDto.RoleName);

        return result;
    }
}