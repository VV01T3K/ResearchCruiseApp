using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;

namespace ResearchCruiseApp_API.Application.UseCases.Account.ConfirmEmail;


public class ConfirmEmailHandler(IIdentityService identityService) : IRequestHandler<ConfirmEmailCommand, Result>
{
    public Task<Result> Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
    {
        return identityService.ConfirmEmail(request.UserId, request.Code, request.ChangedEmail);
    }
}