using System.Globalization;
using System.Resources;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using ResearchCruiseApp_API.App_GlobalResources;
using ResearchCruiseApp_API.Data;
using MimeKit;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace ResearchCruiseApp_API.Tools;

public class EmailSender(IConfiguration configuration, IWebHostEnvironment webHostEnvironment) : IEmailSender
{
    public async Task SendAccountConfirmationMessageAsync(
        User user, string email, string roleName, IServiceProvider serviceProvider, bool changeEmail = false)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
        
        var subject = "Potwierdzenie rejestracji konta w systemie rejsów badawczych Biura Armatora Uniwersytetu";
        
        var code = changeEmail
            ? await userManager.GenerateChangeEmailTokenAsync(user, user.Email!)
            : await userManager.GenerateEmailConfirmationTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
        var userId = await userManager.GetUserIdAsync(user);
        var protocol = configuration.GetSection("ProtocolUsed").Value;
        var frontendUrl = configuration.GetSection("FrontendUrl").Value;

        var link = $"{protocol}://{frontendUrl}/confirmEmail?userId={userId}&code={code}";
        if (changeEmail)
        {
            // This is validated by the /confirmEmail endpoint on change.
            link += $"&changedEmail={user.Email}";
        }

        var emailTemplatePath = webHostEnvironment.WebRootPath + Path.DirectorySeparatorChar +
                                "Templates" + Path.DirectorySeparatorChar +
                                "EmailTemplates" + Path.DirectorySeparatorChar +
                                "accountConfirmationEmail.html"; ;

        var cultureInfo = new CultureInfo("pl-pl");
        var resourceManager = 
            new ResourceManager("ResearchCruiseApp_API.App_GlobalResources.Roles", typeof(Roles).Assembly);
        
        var emailBody = (await File.ReadAllTextAsync(emailTemplatePath))
            .Replace("{{firstName}}", user.FirstName)
            .Replace("{{lastName}}", user.LastName)
            .Replace("{{roleText}}", $" {resourceManager.GetString(roleName, cultureInfo)} ")
            .Replace("{{link}}", link);


        await SendEmail(email, subject, emailBody);
    }

    public async Task SendAccountAcceptedMessageAsync(User user)
    {
        var subject = "Powiadomienie o akceptacji konta przez Biuro Armatora Uniwersytetu";
        
        var emailTemplatePath = webHostEnvironment.WebRootPath + Path.DirectorySeparatorChar +
                                "Templates" + Path.DirectorySeparatorChar +
                                "EmailTemplates" + Path.DirectorySeparatorChar +
                                "accountAcceptedEmail.html";
        
        var emailBody = (await File.ReadAllTextAsync(emailTemplatePath))
            .Replace("{{firstName}}", user.FirstName)
            .Replace("{{lastName}}", user.LastName);
        
        await SendEmail(user.Email!, subject, emailBody);
    }
    
    public Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }

    public Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
    {
        throw new NotImplementedException();
    }
    
    
    private async Task SendEmail(string email, string subject, string body)
    {
        var smtpSettings = configuration.GetSection("SmtpSettings");

        using var client = new SmtpClient();
        await client.ConnectAsync(
            smtpSettings.GetSection("SmtpServer").Value,
            int.Parse(smtpSettings.GetSection("SmtpPort").Value ?? ""),
            true);
        await client.AuthenticateAsync(
            smtpSettings.GetSection("SmtpUsername").Value,
            smtpSettings.GetSection("SmtpPassword").Value);

        var bodyBuilder = new BodyBuilder()
        {
            HtmlBody = body
        };
            
        var message = new MimeMessage()
        {
            Body = bodyBuilder.ToMessageBody()
        };
        message.From.Add(new MailboxAddress(
            smtpSettings.GetSection("SenderName").Value,
            smtpSettings.GetSection("SmtpUsername").Value)
        );
        message.To.Add(new MailboxAddress(email, email));
        message.Subject = subject;
            
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}