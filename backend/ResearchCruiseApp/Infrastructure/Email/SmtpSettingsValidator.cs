using Microsoft.Extensions.Options;
using MimeKit;

namespace ResearchCruiseApp.Infrastructure.Email;

internal sealed class SmtpSettingsValidator : IValidateOptions<SmtpSettings>
{
    public ValidateOptionsResult Validate(string? name, SmtpSettings options)
    {
        if (options.UseFakeSmtp)
        {
            if (string.IsNullOrWhiteSpace(options.FakeSmtpDirectory))
                return ValidateOptionsResult.Fail(
                    "SmtpSettings:FakeSmtpDirectory is required when fake SMTP is enabled."
                );
            try
            {
                _ = Path.GetFullPath(options.FakeSmtpDirectory);
            }
            catch (Exception exception)
                when (exception
                        is ArgumentException
                            or NotSupportedException
                            or PathTooLongException
                )
            {
                return ValidateOptionsResult.Fail(
                    "SmtpSettings:FakeSmtpDirectory must be a valid filesystem path."
                );
            }
            return ValidateOptionsResult.Success;
        }

        List<string> failures = [];
        if (
            string.IsNullOrWhiteSpace(options.SmtpServer)
            || Uri.CheckHostName(options.SmtpServer) == UriHostNameType.Unknown
        )
            failures.Add(
                "SmtpSettings:SmtpServer must be a hostname or IP address, without a URL scheme or port."
            );
        if (options.SmtpPort is < 1 or > 65535)
            failures.Add(
                "SmtpSettings:SmtpPort must be between 1 and 65535 (465 for Gmail implicit TLS)."
            );
        if (
            string.IsNullOrWhiteSpace(options.SmtpUsername)
            || !MailboxAddress.TryParse(options.SmtpUsername, out var mailbox)
            || !string.Equals(mailbox.Address, options.SmtpUsername, StringComparison.Ordinal)
            || !mailbox.Address.Contains('@', StringComparison.Ordinal)
        )
            failures.Add(
                "SmtpSettings:SmtpUsername must be a mailbox address; set SmtpSettings__SmtpUsername for direct hosting."
            );
        if (string.IsNullOrWhiteSpace(options.SmtpPassword))
            failures.Add(
                "SmtpSettings:SmtpPassword is required; set SmtpSettings__SmtpPassword for direct hosting."
            );

        // Report setting names only, never configuration values or parser exception messages.
        return failures.Count == 0
            ? ValidateOptionsResult.Success
            : ValidateOptionsResult.Fail(failures);
    }
}
