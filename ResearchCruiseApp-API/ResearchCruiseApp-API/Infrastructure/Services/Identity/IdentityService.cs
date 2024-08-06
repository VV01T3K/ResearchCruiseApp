using System.ComponentModel.DataAnnotations;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.DTOs.Account;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Services.Identity;


public class IdentityService(
    UserManager<User> userManager,
    RoleManager<IdentityRole> roleManager,
    IUserStore<User> userStore,
    IEmailSender emailSender,
    ICurrentUserService currentUserService)
    : IIdentityService
{
    public async Task<User?> GetUserById(Guid id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        return user;
    }

    public Task<List<User>> GetAllUsers(CancellationToken cancellationToken)
    {
        return userManager.Users.ToListAsync(cancellationToken);
    }
    
    public async Task<bool> UserWithEmailExists(string email)
    {
        return await userManager.FindByEmailAsync(email) is not null;
    }
    
    public async Task<Result> AcceptUser(Guid id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        if (user is null)
            return Error.NotFound();
        
        user.Accepted = true;
        
        var identityResult = await userManager.UpdateAsync(user);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult();
        
        await emailSender.SendAccountAcceptedMessage(user);
        
        return Result.Empty;
    }
    
    public async Task<Result> RegisterUser(
        RegisterFormDto registerForm, string roleName, CancellationToken cancellationToken)
    {
        var emailAddressAttribute = new EmailAddressAttribute();
        
        if (!userManager.SupportsUserEmail)
            return Error.ServiceUnavailable();

        if (string.IsNullOrEmpty(registerForm.Email) || !emailAddressAttribute.IsValid(registerForm.Email))
            return Error.BadRequest("E-mail jest niepoprawny");

        var user = await CreateUser(registerForm, cancellationToken);
        var identityResult = await userManager.CreateAsync(user, registerForm.Password);
        await userManager.AddToRoleAsync(user, roleName);

        var emailConfirmationCode = await CreateEmailConfirmationCode(user, false);
        await emailSender.SendEmailConfirmationEmail(user, roleName, emailConfirmationCode);

        return identityResult.ToApplicationResult();
    }

    public async Task<Result> AddUserWithRole(User user, string password, string roleName)
    {
        var identityResult = await userManager.CreateAsync(user, password);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult();
        
        identityResult = await userManager.AddToRoleAsync(user, roleName);
        
        var emailConfirmationCode = await CreateEmailConfirmationCode(user, false);
        await emailSender.SendEmailConfirmationEmail(user, roleName, emailConfirmationCode);
        
        return identityResult.ToApplicationResult();
    }

    public async Task<Result> AddRoleToUser(User user, string roleName)
    {
        var result = await userManager.AddToRoleAsync(user, roleName);
        return result.ToApplicationResult();
    }

    public async Task<Result> RemoveRoleFromUser(User user, string roleName)
    {
        var result = await userManager.RemoveFromRoleAsync(user, roleName);
        return result.ToApplicationResult();
    }

    public Task<IList<string>> GetUserRolesNames(User user)
    {
        return userManager.GetRolesAsync(user);
    }
    
    public async Task<IList<string>> GetCurrentUserRoleNames()
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
            return [];

        var currentUser = await userManager.FindByIdAsync(currentUserId.ToString()!);
        if (currentUser is null)
            return [];

        return await userManager.GetRolesAsync(currentUser);
    }
    
    public Task<List<string?>> GetAllRoleNames(CancellationToken cancellationToken)
    {
        return roleManager.Roles
            .Select(role => role.Name)
            .ToListAsync(cancellationToken);
    }
    

    private async Task<User> CreateUser(RegisterFormDto registerForm, CancellationToken cancellationToken)
    {
        var emailStore = (IUserEmailStore<User>)userStore;
        
        var user = new User();
        await userStore.SetUserNameAsync(user, registerForm.Email, cancellationToken);
        await emailStore.SetEmailAsync(user, registerForm.Email, cancellationToken);
        user.FirstName = registerForm.FirstName;
        user.LastName = registerForm.LastName;

        return user;
    }

    private async Task<string> CreateEmailConfirmationCode(User user, bool changeEmail)
    {
        var code = changeEmail
            ? await userManager.GenerateChangeEmailTokenAsync(user, user.Email!)
            : await userManager.GenerateEmailConfirmationTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

        return code;
    }
}