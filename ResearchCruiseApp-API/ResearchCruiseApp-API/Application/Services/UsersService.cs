using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common;
using ResearchCruiseApp_API.Application.DTOs.Users;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence.DbContexts;
using ResearchCruiseApp_API.Infrastructure.Tools;

namespace ResearchCruiseApp_API.Application.Services;


public class UsersService(
    UsersContext usersContext,
    IUserPermissionVerifier userPermissionVerifier,
    IServiceProvider serviceProvider,
    UserManager<User> userManager)
    : IUsersService
{
    public async Task<Result<List<UserModel>>> GetAllUsers(ClaimsPrincipal currentUser)
    {
        var allUsers = await usersContext.Users.ToListAsync();

        var userModels = new List<UserModel>();
        foreach (var user in allUsers)
        {
            if (await userPermissionVerifier.CanUserAccessAsync(currentUser, user))
                userModels.Add(await UserModel.GetAsync(user, userManager));
        }
            
        return userModels;
    }
    
    public async Task<Result<UserModel>> GetUserById(Guid id, ClaimsPrincipal currentUser)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        
        if (user == null)
            return Error.NotFound();
        if (await userPermissionVerifier.CanUserAccessAsync(currentUser, user))
            return Error.NotFound(); // Returning Forbidden would provide with too much information
  
        return await UserModel.GetAsync(user, userManager);
    }

    public async Task<Result> AddUser(RegisterModel registerModel, ClaimsPrincipal currentUser)
    {
        if (registerModel.Role is null)
            return Error.BadRequest("Nie wybrano roli dla nowego użytkownika");

        var emailAddressAttribute = new EmailAddressAttribute();
        if (string.IsNullOrEmpty(registerModel.Email) || !emailAddressAttribute.IsValid(registerModel.Email))
            return Error.BadRequest("Adres e-mail jest niepoprawny");

        if (!await userPermissionVerifier.CanUserAssignRoleAsync(currentUser, registerModel.Role))
            return Error.Forbidden("Nie można nadać tej roli");

        if (await userManager.FindByEmailAsync(registerModel.Email) != null)
            return Error.Conflict("Użytkownik o tym adresie e-mail już istnieje");

        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var rolesNames = await roleManager.Roles
            .Select(role => role.Name)
            .ToListAsync();
        if (!rolesNames.Contains(registerModel.Role))
            return Error.BadRequest("Rola nie istnieje");

        var newUser = new User()
        {
            UserName = registerModel.Email,
            Email = registerModel.Email,
            FirstName = registerModel.FirstName,
            LastName = registerModel.LastName,
            Accepted = true
        };
        await userManager.CreateAsync(newUser, registerModel.Password);
        await userManager.AddToRoleAsync(newUser, registerModel.Role);

        var emailSender = serviceProvider.GetRequiredService<IEmailSender>();
        await emailSender.SendAccountConfirmationMessageAsync(
            newUser, registerModel.Email, registerModel.Role, serviceProvider);

        return Result.Empty;
    }
    
    public async Task<Result<List<UserModel>>> GetAllUnacceptedUsers()
    {
        var users = await usersContext.Users
            .Where(user => user.EmailConfirmed && !user.Accepted)
            .ToListAsync();
        var userModels = new List<UserModel>();

        foreach (var user in users)
        {
            userModels.Add(await UserModel.GetAsync(user, userManager));
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
    
    public async Task<Result> ToggleUserRole(Guid userId, ToggleUserRoleModel toggleUserRoleModel)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.NotFound();
            
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var rolesNames = await roleManager.Roles
            .Select(role => role.Name!)
            .ToListAsync();

        if (rolesNames.Contains(toggleUserRoleModel.RoleName))
            await userManager.AddToRoleAsync(user, toggleUserRoleModel.RoleName);
        else
            return Error.BadRequest("Rola nie istnieje");

        if (toggleUserRoleModel.AddRole)
            await userManager.AddToRoleAsync(user, toggleUserRoleModel.RoleName);
        else
            await userManager.RemoveFromRoleAsync(user, toggleUserRoleModel.RoleName);

        return Result.Empty;
    }
}