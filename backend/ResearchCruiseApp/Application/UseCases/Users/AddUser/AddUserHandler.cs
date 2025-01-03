using System.ComponentModel.DataAnnotations;
using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Application.UseCases.Users.AddUser;

public class AddUserHandler(
    IRandomGenerator randomGenerator,
    IUserPermissionVerifier userPermissionVerifier,
    IIdentityService identityService
) : IRequestHandler<AddUserCommand, Result>
{
    public async Task<Result> Handle(AddUserCommand request, CancellationToken cancellationToken)
    {
        if (request.AddUserForm.Role is null)
            return Error.InvalidArgument("Nie wybrano roli dla nowego użytkownika");

        var emailAddressAttribute = new EmailAddressAttribute();
        if (
            string.IsNullOrEmpty(request.AddUserForm.Email)
            || !emailAddressAttribute.IsValid(request.AddUserForm.Email)
        )
            return Error.InvalidArgument("Adres e-mail jest niepoprawny");

        if (!await userPermissionVerifier.CanCurrentUserAssignRole(request.AddUserForm.Role))
            return Error.ForbiddenOperation("Nie można nadać tej roli");

        if (await identityService.UserWithEmailExists(request.AddUserForm.Email))
            return Error.Conflict("Użytkownik o tym adresie e-mail już istnieje");

        var rolesNames = await identityService.GetAllRoleNames(cancellationToken);
        if (!rolesNames.Contains(request.AddUserForm.Role))
            return Error.InvalidArgument("Rola nie istnieje");

        var password = randomGenerator.CreateSecurePassword();

        var result = await identityService.AddUserWithRole(
            request.AddUserForm,
            password,
            request.AddUserForm.Role
        );

        return result;
    }
}
