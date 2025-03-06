using System.Globalization;
using System.Resources;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using NeoSmart.Utils;
using ResearchCruiseApp.App_GlobalResources;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.DTOs.Users;
using ResearchCruiseApp.Domain.Entities;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace ResearchCruiseApp.Infrastructure.Services;

internal class EmailSender(
    IConfiguration configuration,
    ITemplateFileReader templateFileReader,
    IGlobalizationService globalizationService
) : IEmailSender
{
    public async Task SendEmailConfirmationEmail(
        UserDto userDto,
        string roleName,
        string emailConfirmationCode
    )
    {
        var link =
            GetFrontEndUrl() + $"/confirmEmail?userId={userDto.Id}&code={emailConfirmationCode}";

        var messageTemplate = await templateFileReader.ReadEmailConfirmationMessageTemplate();
        var emailSubject = await templateFileReader.ReadEmailConfirmationEmailSubject();

        var cultureInfo = new CultureInfo("pl-pl");
        var resourceManager = new ResourceManager(
            "ResearchCruiseApp.App_GlobalResources.Roles",
            typeof(Roles).Assembly
        );

        var emailMessage = messageTemplate
            .Replace("{{firstName}}", userDto.FirstName)
            .Replace("{{lastName}}", userDto.LastName)
            .Replace("{{roleText}}", $" {resourceManager.GetString(roleName, cultureInfo)} ")
            .Replace("{{link}}", link);

        await SendEmail(userDto.Email, emailSubject, emailMessage);
    }

    public async Task SendAccountCreatedMessage(UserDto userDto, string roleName, string password)
    {
        var messageTemplate = await templateFileReader.ReadAccountCreatedMessageTemplate();
        var emailSubject = await templateFileReader.ReadAccountCreatedEmailSubject();

        var cultureInfo = new CultureInfo("pl-pl");
        var resourceManager = new ResourceManager(
            "ResearchCruiseApp.App_GlobalResources.Roles",
            typeof(Roles).Assembly
        );

        var emailMessage = messageTemplate
            .Replace("{{firstName}}", userDto.FirstName)
            .Replace("{{lastName}}", userDto.LastName)
            .Replace("{{roleText}}", $" {resourceManager.GetString(roleName, cultureInfo)} ")
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

    public async Task SendPasswordResetMessage(UserDto userDto, string resetCode)
    {
        var messageTemplate = await templateFileReader.ReadPasswordResetMessageTemplate();
        var emailSubject = await templateFileReader.ReadPasswordResetEmailSubject();
        var emailBase64 = UrlBase64.Encode(Encoding.UTF8.GetBytes(userDto.Email));

        var link =
            GetFrontEndUrl() + $"/resetPassword?emailBase64={emailBase64}&resetCode={resetCode}";

        var emailMessage = messageTemplate.Replace("{{link}}", link);

        await SendEmail(userDto.Email, emailSubject, emailMessage);
    }

    public async Task SendRequestToSupervisorMessage(
        Guid cruiseApplicationId,
        byte[] supervisorCode,
        UserDto cruiseManager,
        string supervisorEmail
    )
    {
        var supervisorCodeEncoded = Base64UrlEncoder.Encode(supervisorCode);

        var link =
            GetFrontEndUrl()
            + $"/cruiseapproval?cruiseApplicationId={cruiseApplicationId}&supervisorCode={supervisorCodeEncoded}";

        var messageTemplate = await templateFileReader.ReadRequestToSupervisorMessageTemplate();
        var emailSubject = await templateFileReader.ReadRequestToSupervisorEmailSubject();

        var emailMessage = messageTemplate
            .Replace("{{cruiseManagerFirstName}}", cruiseManager.FirstName)
            .Replace("{{cruiseManagerLastName}}", cruiseManager.LastName)
            .Replace("{{cruiseManagerEmail}}", cruiseManager.Email)
            .Replace("{{link}}", link);

        await SendEmail(supervisorEmail, emailSubject, emailMessage);
    }

    public async Task SendCruiseConfirmMessage(Cruise cruise, UserDto cruiseManager, string email)
    {
        var messageTemplate = await templateFileReader.ReadCruiseConfirmedMessageTemplate();
        var emailSubject = await templateFileReader.ReadCruiseConfirmedSubject();

        var emailMessage = messageTemplate
            .Replace("{{startDate}}", globalizationService.GetLocalString(cruise.StartDate))
            .Replace("{{endDate}}", globalizationService.GetLocalString(cruise.EndDate))
            .Replace("{{firstName}}", cruiseManager.FirstName)
            .Replace("{{lastName}}", cruiseManager.LastName);

        await SendEmail(email, emailSubject, emailMessage);
    }

    private async Task SendEmail(string email, string subject, string body)
    {
        var smtpSettings = configuration.GetSection("SmtpSettings");

        using var client = new SmtpClient();
        await client.ConnectAsync(
            smtpSettings.GetSection("SmtpServer").Value,
            int.Parse(smtpSettings.GetSection("SmtpPort").Value ?? ""),
            true
        );
        await client.AuthenticateAsync(
            smtpSettings.GetSection("SmtpUsername").Value,
            smtpSettings.GetSection("SmtpPassword").Value
        );

        var bodyBuilder = new BodyBuilder { HtmlBody = body };

        var message = new MimeMessage { Body = bodyBuilder.ToMessageBody() };
        message.From.Add(
            new MailboxAddress(
                smtpSettings.GetSection("SenderName").Value,
                smtpSettings.GetSection("SmtpUsername").Value
            )
        );
        message.To.Add(new MailboxAddress(email, email));
        message.Subject = subject;

        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }

    private string GetFrontEndUrl()
    {
        var frontendUrl = configuration.GetSection("FrontendUrl").Value;
        return $"{frontendUrl}";
    }
}
