using MediatR;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Account;

namespace ResearchCruiseApp_API.Application.UseCases.Account.Login;


public class LoginHandler(IIdentityService identityService) : IRequestHandler<LoginCommand, Result<LoginResponseDto>>
{
    public async Task<Result<LoginResponseDto>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        if (!await identityService.CanUserLogin(request.LoginFormDto.Email, request.LoginFormDto.Password))
            return Error.UnknownIdentity();

        return await identityService.LoginUser(request.LoginFormDto.Email);
    }
}