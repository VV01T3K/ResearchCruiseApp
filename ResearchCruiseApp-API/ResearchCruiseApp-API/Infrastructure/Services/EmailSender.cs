using System.Globalization;
using System.Resources;
using MimeKit;
using ResearchCruiseApp_API.App_GlobalResources;
using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Application.ExternalServices;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace ResearchCruiseApp_API.Infrastructure.Services;


internal class EmailSender(
    IConfiguration configuration,
    ITemplateFileReader templateFileReader) : IEmailSender
{
    public async Task SendEmailConfirmationEmail(
        UserDto userDto, string roleName, string emailConfirmationCode, string? password = null)
    {
        var link = GetFrontEndUrl() + $"/confirmEmail?userId={userDto.Id}&code={emailConfirmationCode}";

        var messageTemplate = password is null
            ? await templateFileReader.ReadEmailConfirmationMessageTemplate()
            : await templateFileReader.ReadEmailConfirmationMessageWithPasswordTemplate();
        var emailSubject = await templateFileReader.ReadEmailConfirmationEmailSubject();
        
        var cultureInfo = new CultureInfo("pl-pl");
        var resourceManager = new ResourceManager(
            "ResearchCruiseApp_API.App_GlobalResources.Roles",
            typeof(Roles).Assembly);
        
        var emailMessage = messageTemplate
            .Replace("{{firstName}}", userDto.FirstName)
            .Replace("{{lastName}}", userDto.LastName)
            .Replace("{{roleText}}", $" {resourceManager.GetString(roleName, cultureInfo)} ")
            .Replace("{{link}}", link)
            .Replace("{{password}}", password);

        await SendEmail(userDto.Email, emailSubject, emailMessage);
    }
    
    public async Task SendAccountAcceptedMessage(UserDto userDto)
    {
        var messageTemplate = await templateFileReader.ReadAccountAcceptedMessageTemplate();
        var emailSubject = await templateFileReader.ReadAccountAcceptedEmailSubject();
        
        var emailMessage = messageTemplate
            .Replace("{{firstName}}", userDto.FirstName)
            .Replace("{{lastName}}", userDto.LastName);
        
        await SendEmail(userDto.Email, emailSubject, emailMessage);
    }
    
    public Task SendPasswordResetLink(UserDto userDto, string email, string resetLink)
    {
        throw new NotImplementedException();
    }

    public Task SendPasswordResetCode(UserDto userDto, string email, string resetCode)
    {
        throw new NotImplementedException();
    }

    public async Task SendRequestToSupervisorMessage(
        Guid cruiseApplicationId, string supervisorCode, UserDto cruiseManager, string supervisorEmail)
    {
        var link =
            GetFrontEndUrl() +
            $"/FormAForSupervisor?cruiseApplicationId={cruiseApplicationId}&supervisorCode={supervisorCode}";
        
        var messageTemplate = await templateFileReader.ReadRequestToSupervisorMessageTemplate();
        var emailSubject = await templateFileReader.ReadRequestToSupervisorEmailSubject();

        var emailMessage = messageTemplate
            .Replace("{{cruiseManagerFirstName}}", cruiseManager.FirstName)
            .Replace("{{cruiseManagerLastName}}", cruiseManager.LastName)
            .Replace("{{cruiseManagerEmail}}", cruiseManager.Email)
            .Replace("{{link}}", link);

        await SendEmail(supervisorEmail, emailSubject, emailMessage);
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

    private string GetFrontEndUrl()
    {
        var protocol = configuration.GetSection("ProtocolUsed").Value;
        var frontendUrl = configuration.GetSection("FrontendUrl").Value;
        return $"{protocol}://{frontendUrl}";
    }
}