using System.Globalization;
using System.Resources;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using MimeKit;
using ResearchCruiseApp_API.App_GlobalResources;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Domain.Entities;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace ResearchCruiseApp_API.Infrastructure.Services;


public class EmailSender(IConfiguration configuration, IWebHostEnvironment webHostEnvironment) : IEmailSender
{
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
    
    
    public async Task SendEmail(string email, string subject, string body)
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

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = body
        };
            
        var message = new MimeMessage
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