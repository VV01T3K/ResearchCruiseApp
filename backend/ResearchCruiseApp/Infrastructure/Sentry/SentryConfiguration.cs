using Sentry.Extensibility;

namespace ResearchCruiseApp.Infrastructure.Sentry;

public static class SentryConfiguration
{
    public static void AddResearchCruiseAppSentry(this WebApplicationBuilder builder)
    {
        builder.WebHost.UseSentry(options =>
        {
            // Maximize diagnostic signal while there is no real user data (staging /
            // on-prem pre-launch). Revisit before a real-data production launch.
            // Captures request headers, cookies, client IP and the authenticated user.
            options.SendDefaultPii = true;
            // Attach request bodies to events so failing requests can be replayed.
            options.MaxRequestBodySize = RequestSize.Always;

            options.SetBeforeSend(
                (@event, _) =>
                {
                    @event.ServerName = null;
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
}
