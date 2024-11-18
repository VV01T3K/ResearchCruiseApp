using MediatR;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Account.ResetPassword;


public class ResetPasswordHandler(IIdentityService identityService) : IRequestHandler<ResetPasswordCommand, Result>
{
    public Task<Result> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        return identityService.ResetPassword(request.ResetPasswordFormDto);
    }
}