using Sentry.Extensibility;

namespace ResearchCruiseApp.Infrastructure.Sentry;

public static class SentryConfiguration
{
    public static void AddResearchCruiseAppSentry(this WebApplicationBuilder builder)
    {
        // Opt-in, off by default. Enable only where there is no real user data
        // (staging / on-prem pre-launch) to maximize diagnostic signal; never enable
        // for a real-data deployment without a privacy review. When on, Sentry
        // captures request headers, cookies, client IP, the authenticated user and
        // full request bodies so failing requests can be replayed.
        var captureFullRequestData = builder.Configuration.GetValue<bool>(
            "Sentry:CaptureFullRequestData"
        );

        builder.WebHost.UseSentry(options =>
        {
            if (captureFullRequestData)
            {
                options.SendDefaultPii = true;
                options.MaxRequestBodySize = RequestSize.Always;
            }

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
