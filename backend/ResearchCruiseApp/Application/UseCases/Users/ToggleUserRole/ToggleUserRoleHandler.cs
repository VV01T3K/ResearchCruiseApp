using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Users.ToggleUserRole;


public class ToggleUserRoleHandler(IIdentityService identityService) : IRequestHandler<ToggleUserRoleCommand, Result>
{
    public async Task<Result> Handle(ToggleUserRoleCommand request, CancellationToken cancellationToken)
    {
        var rolesNames = await identityService.GetAllRoleNames(cancellationToken);

        if (!rolesNames.Contains(request.RoleToggleDto.RoleName))
            return Error.InvalidArgument("Rola nie istnieje");

        var result = request.RoleToggleDto.AddRole
            ? await identityService.AddRoleToUser(request.UserId, request.RoleToggleDto.RoleName)
            : await identityService.RemoveRoleFromUser(request.UserId, request.RoleToggleDto.RoleName);

        return result;
    }
}