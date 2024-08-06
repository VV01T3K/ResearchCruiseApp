using System.Globalization;
using System.Resources;
using MimeKit;
using ResearchCruiseApp_API.App_GlobalResources;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Domain.Entities;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace ResearchCruiseApp_API.Infrastructure.Services;


public class EmailSender(
    IConfiguration configuration,
    ITemplateFileReader templateFileReader) : IEmailSender
{
    public async Task SendEmailConfirmationEmail(User user, string roleName, string emailConfirmationCode)
    {
        var protocol = configuration.GetSection("ProtocolUsed").Value;
        var frontendUrl = configuration.GetSection("FrontendUrl").Value;
        var link = $"{protocol}://{frontendUrl}/confirmEmail?userId={user.Id}&code={emailConfirmationCode}";
        
        var messageTemplate = await templateFileReader.ReadEmailConfirmationMessageTemplate();
        var emailSubject = await templateFileReader.ReadEmailConfirmationEmailSubject();
        
        var cultureInfo = new CultureInfo("pl-pl");
        var resourceManager = new ResourceManager(
            "ResearchCruiseApp_API.App_GlobalResources.Roles",
            typeof(Roles).Assembly);
        var emailMessage = messageTemplate
            .Replace("{{firstName}}", user.FirstName)
            .Replace("{{lastName}}", user.LastName)
            .Replace("{{roleText}}", $" {resourceManager.GetString(roleName, cultureInfo)} ")
            .Replace("{{link}}", link);

        await SendEmail(user.Email!, emailSubject, emailMessage);
    }
    
    public async Task SendAccountAcceptedMessage(User user)
    {
        var messageTemplate = await templateFileReader.ReadAccountAcceptedMessageTemplate();
        var emailSubject = await templateFileReader.ReadAccountAcceptedEmailSubject();
        
        var emailMessage = messageTemplate
            .Replace("{{firstName}}", user.FirstName)
            .Replace("{{lastName}}", user.LastName);
        
        await SendEmail(user.Email!, emailSubject, emailMessage);
    }
    
    public Task SendPasswordResetLink(User user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }

    public Task SendPasswordResetCode(User user, string email, string resetCode)
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