using MediatR;
using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Application.UseCases.Users.DeleteUser;

public class DeleteUserCommandHandler(
    IIdentityService identityService,
    IUserPermissionVerifier userPermissionVerifier
) : IRequestHandler<DeleteUserCommand, Result>
{
    public async Task<Result> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        if (!await userPermissionVerifier.CanUserDeleteOtherUsers(request.Id))
            return Error.ForbiddenOperation();

        var userRoles = await identityService.GetUserRolesNames(request.Id);
        if (userRoles.Contains(RoleName.Administrator))
        {
            var adminCount = await identityService.GetUsersCountInRole(RoleName.Administrator);
            if (adminCount <= 1)
                return Error.Conflict("Nie można usunąć ostatniego administratora");
        }

        var result = await identityService.DeleteUser(request.Id);

        return result;
    }
}
