using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Account.ConfirmEmail;


public class ConfirmEmailHandler(IIdentityService identityService) : IRequestHandler<ConfirmEmailCommand, Result>
{
    public Task<Result> Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
    {
        return identityService.ConfirmEmail(request.UserId, request.Code, request.ChangedEmail);
    }
}