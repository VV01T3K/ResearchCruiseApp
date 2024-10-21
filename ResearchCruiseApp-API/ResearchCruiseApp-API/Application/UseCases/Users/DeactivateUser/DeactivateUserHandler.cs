using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;

namespace ResearchCruiseApp_API.Application.UseCases.Users.DeactivateUser;


public class DeactivateUserHandler(IIdentityService identityService, ICurrentUserService currentUserService) : IRequestHandler<DeactivateUserCommand, Result>
{
    public async Task<Result> Handle(DeactivateUserCommand request, CancellationToken cancellationToken)
    {
        if (request.Id == currentUserService.GetId())
            return Error.ForbiddenOperation("Nie można dezaktywować bieżącego.");

        var status = await identityService.DeactivateUser(request.Id);
        
        return status;
    }
}