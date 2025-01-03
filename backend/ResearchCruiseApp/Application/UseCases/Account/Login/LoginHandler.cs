using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Account;

namespace ResearchCruiseApp.Application.UseCases.Account.Login;

public class LoginHandler(IIdentityService identityService)
    : IRequestHandler<LoginCommand, Result<LoginResponseDto>>
{
    public async Task<Result<LoginResponseDto>> Handle(
        LoginCommand request,
        CancellationToken cancellationToken
    )
    {
        if (
            !await identityService.CanUserLogin(
                request.LoginFormDto.Email,
                request.LoginFormDto.Password
            )
        )
            return Error.UnknownIdentity();

        return await identityService.LoginUser(request.LoginFormDto.Email);
    }
}
