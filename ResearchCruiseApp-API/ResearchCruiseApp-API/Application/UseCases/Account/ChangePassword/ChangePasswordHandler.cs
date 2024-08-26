using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;

namespace ResearchCruiseApp_API.Application.UseCases.Account.ChangePassword;


public class ChangePasswordHandler(IIdentityService identityService) : IRequestHandler<ChangePasswordCommand, Result>
{
    public Task<Result> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        return identityService.ChangePassword(request.ChangePasswordFormDto);
    }
}