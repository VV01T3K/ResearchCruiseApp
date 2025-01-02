using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Account.ChangePassword;


public class ChangePasswordHandler(IIdentityService identityService) : IRequestHandler<ChangePasswordCommand, Result>
{
    public Task<Result> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        return identityService.ChangePassword(request.ChangePasswordFormDto);
    }
}