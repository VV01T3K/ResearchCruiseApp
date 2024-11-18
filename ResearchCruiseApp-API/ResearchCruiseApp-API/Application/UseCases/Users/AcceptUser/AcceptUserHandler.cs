using MediatR;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Users.AcceptUser;


public class AcceptUserHandler(IIdentityService identityService) : IRequestHandler<AcceptUserCommand, Result>
{
    public Task<Result> Handle(AcceptUserCommand request, CancellationToken cancellationToken)
    {
        return identityService.AcceptUser(request.Id);
    }
}