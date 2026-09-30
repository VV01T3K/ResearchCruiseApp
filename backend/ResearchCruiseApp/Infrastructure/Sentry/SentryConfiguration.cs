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
                (transaction, _) => IsHealthTransaction(transaction.Name) ? null : transaction
            );
        });
    }

    internal static bool IsHealthTransaction(string transactionName) =>
        transactionName.EndsWith("/health", StringComparison.OrdinalIgnoreCase);

    internal static void ScrubSensitiveData(SentryEvent @event)
    {
        // Never send the client IP address.
        if (@event.User is not null)
        {
            @event.User.IpAddress = null;
        }

        var request = @event.Request;

        // Sentry fills a missing user IP from REMOTE_ADDR, and SERVER_NAME repeats the
        // host name that is already removed from the event.
        request.Env.Remove("REMOTE_ADDR");
        request.Env.Remove("SERVER_NAME");

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
