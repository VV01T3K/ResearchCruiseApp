using MediatR;
using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Users.ToggleUserRole;

public class ToggleUserRoleHandler(IIdentityService identityService, IUnitOfWork unitOfWork)
    : IRequestHandler<ToggleUserRoleCommand, Result>
{
    public async Task<Result> Handle(
        ToggleUserRoleCommand request,
        CancellationToken cancellationToken
    )
    {
        var rolesNames = await identityService.GetAllRoleNames(cancellationToken);

        if (!rolesNames.Contains(request.RoleToggleDto.RoleName))
            return Error.InvalidArgument("Rola nie istnieje");

        if (
            !request.RoleToggleDto.AddRole
            && request.RoleToggleDto.RoleName == RoleName.Administrator
        )
        {
            return await unitOfWork.ExecuteIsolated(
                async () =>
                {
                    var adminCount = await identityService.GetUsersCountInRole(
                        RoleName.Administrator
                    );
                    if (adminCount <= 1)
                        return Error.Conflict("Nie można usunąć roli ostatniego administratora");

                    return await identityService.RemoveRoleFromUser(
                        request.UserId,
                        request.RoleToggleDto.RoleName
                    );
                },
                cancellationToken
            );
        }

        var result = request.RoleToggleDto.AddRole
            ? await identityService.AddRoleToUser(request.UserId, request.RoleToggleDto.RoleName)
            : await identityService.RemoveRoleFromUser(
                request.UserId,
                request.RoleToggleDto.RoleName
            );

        return result;
    }
}
