using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;

namespace ResearchCruiseApp_API.Application.UseCases.Account.ResetPassword;


public class ResetPasswordHandler(IIdentityService identityService) : IRequestHandler<ResetPasswordCommand, Result>
{
    public Task<Result> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        return identityService.ResetPassword(request.ResetPasswordFormDto);
    }
}