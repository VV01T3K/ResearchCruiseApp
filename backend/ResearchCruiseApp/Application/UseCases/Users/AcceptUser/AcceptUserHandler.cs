using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Users.AcceptUser;

public class AcceptUserHandler(IIdentityService identityService)
    : IRequestHandler<AcceptUserCommand, Result>
{
    public Task<Result> Handle(AcceptUserCommand request, CancellationToken cancellationToken)
    {
        return identityService.AcceptUser(request.Id);
    }
}
