using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Account.ResetPassword;


public class ResetPasswordHandler(IIdentityService identityService) : IRequestHandler<ResetPasswordCommand, Result>
{
    public Task<Result> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        return identityService.ResetPassword(request.ResetPasswordFormDto);
    }
}