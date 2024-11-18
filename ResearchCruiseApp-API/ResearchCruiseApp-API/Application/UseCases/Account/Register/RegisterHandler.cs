using MediatR;
using ResearchCruiseApp_API.Application.Common.Constants;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Account.Register;


internal class RegisterHandler(IIdentityService identityService) : IRequestHandler<RegisterCommand, Result>
{
    public Task<Result> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        return identityService.RegisterUser(request.RegisterFormDto, RoleName.CruiseManager);
    }
}