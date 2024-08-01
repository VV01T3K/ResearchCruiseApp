using ResearchCruiseApp_API.Application.Common.Models.ServiceResponse;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.UseCases.Account.DTOs;
using ResearchCruiseApp_API.Domain.Common.Constants;

namespace ResearchCruiseApp_API.Application.UseCases.Account;

public class AccountService(IIdentityService identityService) : IAccountService
{
    public Task<Result> Register(RegisterFormDto registerForm, CancellationToken cancellationToken)
    {
        return identityService.RegisterUserAsync(registerForm, RoleName.CruiseManager, cancellationToken);
    }
}