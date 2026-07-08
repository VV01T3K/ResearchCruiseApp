using System.Text.RegularExpressions;
using Sentry.Extensibility;

namespace ResearchCruiseApp.Infrastructure.Sentry;

public static class SentryConfiguration
{
    // Request/session identifiers that must never leave the app.
    private static readonly string[] SensitiveHeaders =
    [
        "Authorization",
        "Proxy-Authorization",
        "Cookie",
        "Set-Cookie",
        "X-Api-Key",
    ];

    // JSON keys whose values are redacted from captured request bodies.
    private static readonly string[] SensitiveBodyKeys =
    [
        "password",
        "currentPassword",
        "newPassword",
        "confirmPassword",
        "token",
        "accessToken",
        "refreshToken",
    ];

    public static void AddResearchCruiseAppSentry(this WebApplicationBuilder builder)
    {
        builder.WebHost.UseSentry(options =>
        {
            // Capture rich request context (headers, body, authenticated user) so
            // production issues can be diagnosed and replicated. Sensitive fields
            // (auth/session headers, client IP, credentials in the body) are scrubbed
            // in SetBeforeSend below.
            options.SendDefaultPii = true;
            options.MaxRequestBodySize = RequestSize.Always;

            options.SetBeforeSend(
                (@event, _) =>
                {
                    @event.ServerName = null;
                    ScrubSensitiveData(@event);
                    return @event;
                }
            );
            options.SetBeforeSendTransaction(
                (transaction, _) =>
                    transaction.Name.EndsWith("/health", StringComparison.OrdinalIgnoreCase)
                        ? null
                        : transaction
            );
        });
    }

    private static void ScrubSensitiveData(SentryEvent @event)
    {
        // Never send the client IP address.
        if (@event.User is not null)
        {
            @event.User.IpAddress = null;
        }

        var request = @event.Request;

        if (request.Headers is not null)
        {
            foreach (var header in SensitiveHeaders)
            {
                request.Headers.Remove(header);
            }
        }
        request.Cookies = null;

        if (request.Data is string body && body.Length > 0)
        {
            request.Data = RedactSensitiveBodyValues(body);
        }
    }

    private static string RedactSensitiveBodyValues(string body)
    {
        foreach (var key in SensitiveBodyKeys)
        {
            // Replace the string value of "<key>": "..." with a placeholder.
            body = Regex.Replace(
                body,
                $"(\"{Regex.Escape(key)}\"\\s*:\\s*)\"[^\"]*\"",
                "$1\"[REDACTED]\"",
                RegexOptions.IgnoreCase
            );
        }
        return body;
    }
}
