using System.ComponentModel.DataAnnotations;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.SharedServices.UserPermissionVerifier;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.Users.AddUser;


public class AddUserHandler(
    IUserPermissionVerifier userPermissionVerifier,
    UserManager<User> userManager,
    RoleManager<IdentityRole> roleManager)
    : IRequestHandler<AddUserCommand, Result> 
{
    public async Task<Result> Handle(AddUserCommand request, CancellationToken cancellationToken)
    {
        if (request.AddUserForm.Role is null)
            return Error.BadRequest("Nie wybrano roli dla nowego użytkownika");

        var emailAddressAttribute = new EmailAddressAttribute();
        if (string.IsNullOrEmpty(request.AddUserForm.Email) || !emailAddressAttribute.IsValid(request.AddUserForm.Email))
            return Error.BadRequest("Adres e-mail jest niepoprawny");

        if (!await userPermissionVerifier.CanUserAssignRoleAsync(request.CurrentUser, request.AddUserForm.Role))
            return Error.Forbidden("Nie można nadać tej roli");

        if (await userManager.FindByEmailAsync(request.AddUserForm.Email) != null)
            return Error.Conflict("Użytkownik o tym adresie e-mail już istnieje");

        var rolesNames = await roleManager.Roles
            .Select(role => role.Name)
            .ToListAsync(cancellationToken);
        if (!rolesNames.Contains(request.AddUserForm.Role))
            return Error.BadRequest("Rola nie istnieje");

        var newUser = new User()
        {
            UserName = request.AddUserForm.Email,
            Email = request.AddUserForm.Email,
            FirstName = request.AddUserForm.FirstName,
            LastName = request.AddUserForm.LastName,
            Accepted = true
        };
        await userManager.CreateAsync(newUser, request.AddUserForm.Password);
        await userManager.AddToRoleAsync(newUser, request.AddUserForm.Role);

        // var emailSender = serviceProvider.GetRequiredService<IEmailSender>();
        // await emailSender.SendAccountConfirmationMessageAsync(
        //     newUser, addUserForm.Email, addUserForm.Role, serviceProvider);

        return Result.Empty;
    }
}