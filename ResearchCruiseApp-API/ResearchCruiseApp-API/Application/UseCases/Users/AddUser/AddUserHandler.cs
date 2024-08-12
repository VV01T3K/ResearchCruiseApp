using System.ComponentModel.DataAnnotations;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.SharedServices.UserPermissionVerifier;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Services.Identity;

namespace ResearchCruiseApp_API.Application.UseCases.Users.AddUser;


public class AddUserHandler(
    IUserPermissionVerifier userPermissionVerifier,
    IIdentityService identityService)
    : IRequestHandler<AddUserCommand, Result> 
{
    public async Task<Result> Handle(AddUserCommand request, CancellationToken cancellationToken)
    {
        if (request.AddUserForm.Role is null)
            return Error.BadRequest("Nie wybrano roli dla nowego użytkownika");

        var emailAddressAttribute = new EmailAddressAttribute();
        if (string.IsNullOrEmpty(request.AddUserForm.Email) || !emailAddressAttribute.IsValid(request.AddUserForm.Email))
            return Error.BadRequest("Adres e-mail jest niepoprawny");

        if (!await userPermissionVerifier.CanCurrentUserAssignRole(request.AddUserForm.Role))
            return Error.Forbidden("Nie można nadać tej roli");
        
        if (await identityService.UserWithEmailExists(request.AddUserForm.Email))
            return Error.Conflict("Użytkownik o tym adresie e-mail już istnieje");

        var rolesNames = await identityService.GetAllRoleNames(cancellationToken);
        if (!rolesNames.Contains(request.AddUserForm.Role))
            return Error.BadRequest("Rola nie istnieje");
        
        var result = await identityService.AddUserWithRole(
            request.AddUserForm, request.AddUserForm.Password, request.AddUserForm.Role);

        return result;
    }
}