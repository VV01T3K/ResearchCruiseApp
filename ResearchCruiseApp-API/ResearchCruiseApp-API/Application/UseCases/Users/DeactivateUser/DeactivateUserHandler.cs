using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;

namespace ResearchCruiseApp_API.Application.UseCases.Users.DeactivateUser;


public class DeactivateUserHandler(IIdentityService identityService) : IRequestHandler<DeactivateUserCommand, Result>
{
    public Task<Result> Handle(DeactivateUserCommand request, CancellationToken cancellationToken)
    {
        return identityService.DeactivateUser(request.Id);
    }
}