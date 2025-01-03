using MediatR;
using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Account.ResendConfirmationEmail;

public class ResendConfirmationEmailHandler(IIdentityService identityService)
    : IRequestHandler<ResendConfirmationEmailCommand, Result>
{
    public async Task<Result> Handle(
        ResendConfirmationEmailCommand request,
        CancellationToken cancellationToken
    )
    {
        await identityService.ResendEmailConfirmationEmail(
            request.EmailDto.Email,
            RoleName.CruiseManager
        );
        return Result.Empty;
    }
}
