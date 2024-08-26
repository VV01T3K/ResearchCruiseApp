using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;

namespace ResearchCruiseApp_API.Application.UseCases.Users.AcceptUser;


public class AcceptUserHandler(IIdentityService identityService) : IRequestHandler<AcceptUserCommand, Result>
{
    public Task<Result> Handle(AcceptUserCommand request, CancellationToken cancellationToken)
    {
        return identityService.AcceptUser(request.Id);
    }
}