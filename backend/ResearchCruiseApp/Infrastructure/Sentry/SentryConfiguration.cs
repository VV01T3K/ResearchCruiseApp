using Sentry.Extensibility;
using Sentry.Protocol;

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

    public static void AddResearchCruiseAppSentry(this WebApplicationBuilder builder)
    {
        builder.WebHost.UseSentry(options =>
        {
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
                {
                    if (IsHealthTransaction(transaction.Name))
                        return null;
                    ScrubSensitiveData(transaction.Request, transaction.User);
                    return transaction;
                }
            );
        });
    }

    internal static bool IsHealthTransaction(string transactionName) =>
        transactionName.EndsWith("/health", StringComparison.OrdinalIgnoreCase);

    internal static void ScrubSensitiveData(SentryEvent @event) =>
        ScrubSensitiveData(@event.Request, @event.User);

    private static void ScrubSensitiveData(SentryRequest request, SentryUser? user)
    {
        // Never send the client IP address.
        if (user is not null)
        {
            user.IpAddress = null;
        }

        if (request.Headers is not null)
        {
            var sensitiveKeys = request.Headers.Keys.Where(key =>
                SensitiveHeaders.Contains(key, StringComparer.OrdinalIgnoreCase)
            );
            foreach (var header in sensitiveKeys.ToArray())
            {
                request.Headers.Remove(header);
            }
        }
        request.Cookies = null;
    }
}
