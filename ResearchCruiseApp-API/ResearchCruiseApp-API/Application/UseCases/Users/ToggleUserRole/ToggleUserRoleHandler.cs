using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;

namespace ResearchCruiseApp_API.Application.UseCases.Users.ToggleUserRole;


public class ToggleUserRoleHandler(IIdentityService identityService) : IRequestHandler<ToggleUserRoleCommand, Result>
{
    public async Task<Result> Handle(ToggleUserRoleCommand request, CancellationToken cancellationToken)
    {
        var rolesNames = await identityService.GetAllRoleNames(cancellationToken);

        if (!rolesNames.Contains(request.RoleToggleDto.RoleName))
            return Error.BadRequest("Rola nie istnieje");

        var result = request.RoleToggleDto.AddRole
            ? await identityService.AddRoleToUser(request.UserId, request.RoleToggleDto.RoleName)
            : await identityService.RemoveRoleFromUser(request.UserId, request.RoleToggleDto.RoleName);

        return result;
    }
}