using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp_API.Application.Common.Models;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResponse;
using ResearchCruiseApp_API.Application.UseCases.Account.DTOs;

namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface IIdentityService
{
    Task<Result> RegisterUserAsync(RegisterFormDto registerForm, string roleName, CancellationToken cancellationToken);
}