using System.ComponentModel.DataAnnotations;
using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Application.UseCases.Users.UpdateUser;

public class UpdateUserCommandHandler(
    IUserPermissionVerifier userPermissionVerifier,
    IIdentityService identityService
) : IRequestHandler<UpdateUserCommand, Result>
{
    public async Task<Result> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var emailAddressAttribute = new EmailAddressAttribute();
        if (
            string.IsNullOrEmpty(request.UpdateUserFormDto.Email)
            || !emailAddressAttribute.IsValid(request.UpdateUserFormDto.Email)
        )
            return Error.InvalidArgument("Adres e-mail jest niepoprawny");

        if (!await userPermissionVerifier.CanCurrentUserAccess(request.UserId))
            return Error.ForbiddenOperation("Nie można edytować tego użytkownika");

        if (request.UpdateUserFormDto.Role is not null)
        {
            if (
                !await userPermissionVerifier.CanCurrentUserAssignRole(
                    request.UpdateUserFormDto.Role
                )
            )
                return Error.ForbiddenOperation("Nie można nadać tej roli");
        }

        var rolesNames = await identityService.GetAllRoleNames(cancellationToken);
        if (
            request.UpdateUserFormDto.Role is not null
            && !rolesNames.Contains(request.UpdateUserFormDto.Role)
        )
            return Error.InvalidArgument("Rola nie istnieje");

        return await identityService.UpdateUser(
            request.UserId,
            request.UpdateUserFormDto,
            cancellationToken
        );
    }
}
