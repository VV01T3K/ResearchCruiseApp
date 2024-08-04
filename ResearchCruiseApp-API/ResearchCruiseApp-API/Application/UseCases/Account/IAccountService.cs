using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Account;

namespace ResearchCruiseApp_API.Application.UseCases.Account;

public interface IAccountService
{
    Task<Result> Register(RegisterFormDto registerForm, CancellationToken cancellationToken);
}