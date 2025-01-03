using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Application.UseCases.Users.DeactivateUser;

public class DeactivateUserHandler(
    IIdentityService identityService,
    IUserPermissionVerifier userPermissionVerifier
) : IRequestHandler<DeactivateUserCommand, Result>
{
    public async Task<Result> Handle(
        DeactivateUserCommand request,
        CancellationToken cancellationToken
    )
    {
        if (!await userPermissionVerifier.CanUserDeactivate(request.Id))
            return Error.ForbiddenOperation();

        var result = await identityService.DeactivateUser(request.Id);

        return result;
    }
}
