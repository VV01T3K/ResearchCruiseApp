using MediatR;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Account.ChangePassword;


public class ChangePasswordHandler(IIdentityService identityService) : IRequestHandler<ChangePasswordCommand, Result>
{
    public Task<Result> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        return identityService.ChangePassword(request.ChangePasswordFormDto);
    }
}