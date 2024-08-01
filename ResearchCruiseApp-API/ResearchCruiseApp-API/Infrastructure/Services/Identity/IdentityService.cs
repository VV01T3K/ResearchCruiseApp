using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Resources;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using ResearchCruiseApp_API.App_GlobalResources;
using ResearchCruiseApp_API.Application.Common.Models;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.DTOs.Account;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Services.Identity;


public class IdentityService(
    UserManager<User> userManager,
    IUserStore<User> userStore,
    ITemplateFileReader templateFileReader,
    IEmailSender emailSender,
    IConfiguration configuration)
    : IIdentityService
{
    public async Task<Result> RegisterUserAsync(
        RegisterFormDto registerForm,
        string roleName,
        CancellationToken cancellationToken)
    {
        var emailStore = (IUserEmailStore<User>)userStore;
        var emailAddressAttribute = new EmailAddressAttribute();
        
        if (!userManager.SupportsUserEmail)
            return Error.ServiceUnavailable();

        if (string.IsNullOrEmpty(registerForm.Email) || !emailAddressAttribute.IsValid(registerForm.Email))
            return Error.BadRequest("E-mail jest niepoprawny");

        var user = new User();
        await userStore.SetUserNameAsync(user, registerForm.Email, cancellationToken);
        await emailStore.SetEmailAsync(user, registerForm.Email, cancellationToken);
        user.FirstName = registerForm.FirstName;
        user.LastName = registerForm.LastName;
            
        var identityResult = await userManager.CreateAsync(user, registerForm.Password);
        await userManager.AddToRoleAsync(user, roleName);

        var emailMessage = await CreateEmailConfirmationMessageAsync(user, roleName, false);
        var emailSubject = await templateFileReader.ReadEmailConfirmationEmailSubjectAsync();

        await emailSender.SendEmail(registerForm.Email, emailSubject, emailMessage);

        return identityResult.ToApplicationResult();
    }


    private async Task<string> CreateEmailConfirmationMessageAsync(User user, string roleName, bool changeEmail)
    {
        var code = changeEmail
            ? await userManager.GenerateChangeEmailTokenAsync(user, user.Email!)
            : await userManager.GenerateEmailConfirmationTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
        var userId = await userManager.GetUserIdAsync(user);
        var protocol = configuration.GetSection("ProtocolUsed").Value;
        var frontendUrl = configuration.GetSection("FrontendUrl").Value;

        var link = $"{protocol}://{frontendUrl}/confirmEmail?userId={userId}&code={code}";
        // if (changeEmail)
        // {
        //     // This is validated by the /confirmEmail endpoint on change.
        //     link += $"&changedEmail={user.Email}";
        // }

        var messageTemplate = await templateFileReader.ReadEmailConfirmationMessageTemplateAsync();
        var cultureInfo = new CultureInfo("pl-pl");
        var resourceManager = new ResourceManager(
            "ResearchCruiseApp_API.App_GlobalResources.Roles",
            typeof(Roles).Assembly);
        
        var message = messageTemplate
            .Replace("{{firstName}}", user.FirstName)
            .Replace("{{lastName}}", user.LastName)
            .Replace("{{roleText}}", $" {resourceManager.GetString(roleName, cultureInfo)} ")
            .Replace("{{link}}", link);

        return message;
    }
}