using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Types;

namespace ResearchCruiseApp_API.Tools;

public static class EmailSenderExtensions
{
    public static async Task SendConfirmationEmailAsync(
        this IEmailSender<User> emailSender,
        User user, string roleName, IServiceProvider serviceProvider, bool changeEmail = false)
    {
        var emailConfirmationMessageBody =
            await GenerateEmailConfirmationMessageBody(user, roleName, changeEmail, serviceProvider);

        await emailSender.SendConfirmationLinkAsync(user, user.Email!, emailConfirmationMessageBody);
    }

    private static async Task<string> GenerateEmailConfirmationMessageBody(
        User user, string roleName, bool isChange, IServiceProvider serviceProvider)
    {
        var configuration = serviceProvider.GetRequiredService<IConfiguration>();
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
        
        var code = isChange
            ? await userManager.GenerateChangeEmailTokenAsync(user, user.Email!)
            : await userManager.GenerateEmailConfirmationTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
        var userId = await userManager.GetUserIdAsync(user);
        var protocol = configuration.GetSection("ProtocolUsed").Value;
        var frontendUrl = configuration.GetSection("FrontendUrl").Value;

        string link = $"{protocol}://{frontendUrl}/confirmEmail?userId={userId}&code={code}";
        if (isChange)
        {
            // This is validated by the /confirmEmail endpoint on change.
            link += $"&changedEmail={user.Email}";
        }

        var emailTemplatePath = Path.Combine("Resources", "Emails", "accountConfirmationEmail.html");
        var emailContent = (await System.IO.File.ReadAllTextAsync(emailTemplatePath))
            .Replace("{{firstName}}", user.FirstName)
            .Replace("{{lastName}}", user.LastName)
            .Replace("{{role}}", RoleName.Translate(roleName, "pl-PL"))
            .Replace("{{link}}", link);

        return emailContent;
    }
}