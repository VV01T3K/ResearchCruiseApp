using System.ComponentModel.DataAnnotations;
using MediatR;
using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Account.Register;

internal class RegisterHandler(IIdentityService identityService)
    : IRequestHandler<RegisterCommand, Result>
{
    public async Task<Result> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var emailAddressAttribute = new EmailAddressAttribute();
        if (
            string.IsNullOrEmpty(request.RegisterFormDto.Email)
            || !emailAddressAttribute.IsValid(request.RegisterFormDto.Email)
        )
            return Error.InvalidArgument("E-mail jest niepoprawny");

        return await identityService.RegisterUser(request.RegisterFormDto, RoleName.CruiseManager);
    }
}
