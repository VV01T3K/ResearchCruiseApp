using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace ResearchCruiseApp.Infrastructure.Email;

internal interface IEmailTransport
{
    Task Deliver(Guid id, EmailPayload payload, CancellationToken cancellationToken);
}

internal sealed class SmtpEmailTransport(IOptions<SmtpSettings> options) : IEmailTransport
{
    public async Task Deliver(Guid id, EmailPayload payload, CancellationToken cancellationToken)
    {
        var settings = options.Value;
        using var message = new MimeMessage
        {
            MessageId = $"{id:N}@researchcruiseapp.outbox",
            Subject = payload.Subject,
            Body = new BodyBuilder { HtmlBody = payload.Body }.ToMessageBody(),
        };
        message.From.Add(new MailboxAddress(settings.SenderName, settings.SmtpUsername));
        message.To.Add(MailboxAddress.Parse(payload.Recipient));

        using var client = new SmtpClient { Timeout = 60000 };
        await client.ConnectAsync(
            settings.SmtpServer,
            settings.SmtpPort,
            SecureSocketOptions.SslOnConnect,
            cancellationToken
        );
        await client.AuthenticateAsync(
            settings.SmtpUsername,
            settings.SmtpPassword,
            cancellationToken
        );
        await client.SendAsync(message, cancellationToken);
        // Delivery has succeeded. A failed QUIT must not schedule another delivery.
    }
}

internal sealed class FakeEmailTransport(IOptions<SmtpSettings> options) : IEmailTransport
{
    public async Task Deliver(Guid id, EmailPayload payload, CancellationToken cancellationToken)
    {
        var directory = Path.GetFullPath(options.Value.FakeSmtpDirectory);
        Directory.CreateDirectory(directory);
        // A retry replaces the same file rather than creating another local notification.
        await File.WriteAllTextAsync(
            Path.Combine(directory, $"{id:N}.html"),
            $"<!-- To: {payload.Recipient}\nSubject: {payload.Subject} -->\n{payload.Body}",
            cancellationToken
        );
    }
}
