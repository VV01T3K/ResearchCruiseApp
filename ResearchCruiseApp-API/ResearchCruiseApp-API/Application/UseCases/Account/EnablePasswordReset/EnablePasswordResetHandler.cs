using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;

namespace ResearchCruiseApp_API.Application.UseCases.Account.EnablePasswordReset;


public class EnablePasswordResetHandler(IIdentityService identityService)
    : IRequestHandler<EnablePasswordResetCommand, Result>
{
    public async Task<Result> Handle(EnablePasswordResetCommand request, CancellationToken cancellationToken)
    {
        var result = await identityService.EnablePasswordReset(request.ForgotPasswordFormDto);
        
        return Result.Empty; // User will not know if the e-mail was correct
    }
}