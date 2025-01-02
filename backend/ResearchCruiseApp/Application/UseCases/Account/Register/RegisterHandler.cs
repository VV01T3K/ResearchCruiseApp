using MediatR;
using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Account.Register;


internal class RegisterHandler(IIdentityService identityService) : IRequestHandler<RegisterCommand, Result>
{
    public Task<Result> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        return identityService.RegisterUser(request.RegisterFormDto, RoleName.CruiseManager);
    }
}