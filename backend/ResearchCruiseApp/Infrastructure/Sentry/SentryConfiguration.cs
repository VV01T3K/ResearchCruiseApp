namespace ResearchCruiseApp.Infrastructure.Sentry;

public static class SentryConfiguration
{
    public static void AddResearchCruiseAppSentry(this WebApplicationBuilder builder)
    {
        builder.WebHost.UseSentry(options =>
        {
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
