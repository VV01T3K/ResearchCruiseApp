using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using ResearchCruiseApp_API.Data;

namespace ResearchCruiseApp_API.Tools;

public class EmailSender<TUser>(IConfiguration configuration) : IEmailSender<TUser>
    where TUser: class
{
    public async Task SendConfirmationLinkAsync(TUser user, string email, string confirmationEmailBody)
    {
        var smtpSettings = configuration.GetSection("SmtpSettings");
        
        using var client = new SmtpClient(
            smtpSettings.GetSection("SmtpServer").Value,
            int.Parse(smtpSettings.GetSection("SmtpPort").Value ?? ""));
        client.UseDefaultCredentials = false;
        client.Credentials = new NetworkCredential(
            smtpSettings.GetSection("SmtpUsername").Value,
            smtpSettings.GetSection("SmtpPassword").Value);
        client.EnableSsl = true;

        var message = new MailMessage
        {
            From = new MailAddress(
                smtpSettings.GetSection("SenderEmail").Value ?? "",
                smtpSettings.GetSection("SenderName").Value),
            Subject = "Potwierdzenie rejestracji konta w systemie rejsów badawczych Biura Armatora Uniwersytetu",
            Body = confirmationEmailBody,
            IsBodyHtml = true
        };

        message.To.Add(email);

        await client.SendMailAsync(message);
    }

    public Task SendPasswordResetLinkAsync(TUser user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }

    public Task SendPasswordResetCodeAsync(TUser user, string email, string resetCode)
    {
        throw new NotImplementedException();
    }
}