using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp_API.Application.UseCases.Users.DeactivateUser;


public class DeactivateUserHandler(
    IIdentityService identityService,
    ICurrentUserService currentUserService,
    IUserPermissionVerifier userPermissionVerifier)
    : IRequestHandler<DeactivateUserCommand, Result>
{
    public async Task<Result> Handle(DeactivateUserCommand request, CancellationToken cancellationToken)
    {
        if (request.Id == currentUserService.GetId())
            return Error.ForbiddenOperation("Nie można dezaktywować własnego konta.");

        if (!await userPermissionVerifier.CanUserDeactivate(request.Id))
            return Error.ForbiddenOperation();

        var result = await identityService.DeactivateUser(request.Id);
        
        return result;
    }
}