using ResearchCruiseApp_API.Application.Common.Models.ServiceResponse;
using ResearchCruiseApp_API.Application.UseCases.Account.DTOs;

namespace ResearchCruiseApp_API.Application.UseCases.Account;

public interface IAccountService
{
    Task<Result> Register(RegisterFormDto registerForm, CancellationToken cancellationToken);
}