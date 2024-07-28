using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common.Models;
using ResearchCruiseApp_API.Application.UseCaseServices.Users.DTOs;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence;
using ResearchCruiseApp_API.Infrastructure.Tools;

namespace ResearchCruiseApp_API.Application.UseCaseServices.Users;


public class UsersService(
    ApplicationDbContext applicationDbContext,
    IUserPermissionVerifier userPermissionVerifier,
    IServiceProvider serviceProvider,
    UserManager<User> userManager)
    : IUsersService
{
    public async Task<Result<List<UserDto>>> GetAllUsers(ClaimsPrincipal currentUser)
    {
        var allUsers = await applicationDbContext.Users.ToListAsync();

        var userModels = new List<UserDto>();
        foreach (var user in allUsers)
        {
            if (await userPermissionVerifier.CanUserAccessAsync(currentUser, user))
                userModels.Add(await UserDto.GetAsync(user, userManager));
        }
            
        return userModels;
    }
    
    public async Task<Result<UserDto>> GetUserById(Guid id, ClaimsPrincipal currentUser)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        
        if (user == null)
            return Error.NotFound();
        if (await userPermissionVerifier.CanUserAccessAsync(currentUser, user))
            return Error.NotFound(); // Returning Forbidden would provide with too much information
  
        return await UserDto.GetAsync(user, userManager);
    }

    public async Task<Result> AddUser(AddUserFormDto addUserForm, ClaimsPrincipal currentUser)
    {
        if (addUserForm.Role is null)
            return Error.BadRequest("Nie wybrano roli dla nowego użytkownika");

        var emailAddressAttribute = new EmailAddressAttribute();
        if (string.IsNullOrEmpty(addUserForm.Email) || !emailAddressAttribute.IsValid(addUserForm.Email))
            return Error.BadRequest("Adres e-mail jest niepoprawny");

        if (!await userPermissionVerifier.CanUserAssignRoleAsync(currentUser, addUserForm.Role))
            return Error.Forbidden("Nie można nadać tej roli");

        if (await userManager.FindByEmailAsync(addUserForm.Email) != null)
            return Error.Conflict("Użytkownik o tym adresie e-mail już istnieje");

        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var rolesNames = await roleManager.Roles
            .Select(role => role.Name)
            .ToListAsync();
        if (!rolesNames.Contains(addUserForm.Role))
            return Error.BadRequest("Rola nie istnieje");

        var newUser = new User()
        {
            UserName = addUserForm.Email,
            Email = addUserForm.Email,
            FirstName = addUserForm.FirstName,
            LastName = addUserForm.LastName,
            Accepted = true
        };
        await userManager.CreateAsync(newUser, addUserForm.Password);
        await userManager.AddToRoleAsync(newUser, addUserForm.Role);

        var emailSender = serviceProvider.GetRequiredService<IEmailSender>();
        await emailSender.SendAccountConfirmationMessageAsync(
            newUser, addUserForm.Email, addUserForm.Role, serviceProvider);

        return Result.Empty;
    }
    
    public async Task<Result<List<UserDto>>> GetAllUnacceptedUsers()
    {
        var users = await applicationDbContext.Users
            .Where(user => user.EmailConfirmed && !user.Accepted)
            .ToListAsync();
        var userModels = new List<UserDto>();

        foreach (var user in users)
        {
            userModels.Add(await UserDto.GetAsync(user, userManager));
        }
        
        return userModels;
    }
    
    public async Task<Result> AcceptUser(Guid id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        if (user == null)
            return Error.NotFound();
            
        user.Accepted = true;
        await userManager.UpdateAsync(user);

        var emailSender = serviceProvider.GetRequiredService<IEmailSender>();
        await emailSender.SendAccountAcceptedMessageAsync(user);

        return Result.Empty;
    }
    
    public async Task<Result> ToggleUserRole(Guid userId, UserRoleToggleDto userRoleToggle)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.NotFound();
            
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var rolesNames = await roleManager.Roles
            .Select(role => role.Name!)
            .ToListAsync();

        if (rolesNames.Contains(userRoleToggle.RoleName))
            await userManager.AddToRoleAsync(user, userRoleToggle.RoleName);
        else
            return Error.BadRequest("Rola nie istnieje");

        if (userRoleToggle.AddRole)
            await userManager.AddToRoleAsync(user, userRoleToggle.RoleName);
        else
            await userManager.RemoveFromRoleAsync(user, userRoleToggle.RoleName);

        return Result.Empty;
    }
}