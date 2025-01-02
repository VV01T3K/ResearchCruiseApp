using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Account.EnablePasswordReset;


public class EnablePasswordResetHandler(IIdentityService identityService)
    : IRequestHandler<EnablePasswordResetCommand, Result>
{
    public async Task<Result> Handle(EnablePasswordResetCommand request, CancellationToken cancellationToken)
    {
        var result = await identityService.EnablePasswordReset(request.ForgotPasswordFormDto);
        
        return Result.Empty; // User will not know if the e-mail was correct
    }
}