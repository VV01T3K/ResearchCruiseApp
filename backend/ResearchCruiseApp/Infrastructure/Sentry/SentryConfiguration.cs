using Sentry;
using Sentry.AspNetCore;
using Sentry.Extensibility;

namespace ResearchCruiseApp.Infrastructure.Sentry;

public static class SentryConfiguration
{
    public static void AddResearchCruiseAppSentry(this WebApplicationBuilder builder)
    {
        builder.WebHost.UseSentry(options =>
        {
            options.Dsn = builder.Configuration["Sentry:Dsn"];
            options.Environment =
                builder.Configuration["Sentry:Environment"]
                ?? builder.Configuration["SENTRY_ENVIRONMENT"]
                ?? builder.Environment.EnvironmentName;
            options.Release =
                builder.Configuration["Sentry:Release"]
                ?? builder.Configuration["SENTRY_RELEASE"]
                ?? $"research-cruise-app-backend@{typeof(SentryConfiguration).Assembly.GetName().Version}";

            options.SendDefaultPii = false;
            options.AttachStacktrace = true;
            options.MaxRequestBodySize = RequestSize.Small;
            options.MinimumBreadcrumbLevel = LogLevel.Debug;
            options.MinimumEventLevel = LogLevel.Warning;
            options.EnableLogs = true;

            options.TracesSampleRate = ResolveTracesSampleRate(builder.Configuration, builder.Environment);
            options.ProfilesSampleRate = ResolveProfilesSampleRate(builder.Configuration, builder.Environment);

            options.SetBeforeSend((@event, _) =>
            {
                @event.ServerName = null;
                return @event;
            });

            options.SetBeforeSendTransaction((transaction, _) =>
            {
                if (transaction.Name.Contains("/health", StringComparison.OrdinalIgnoreCase))
                {
                    return null;
                }

                return transaction;
            });
        });

        builder.Logging.AddSentry(options =>
        {
            options.InitializeSdk = false;
            options.MinimumBreadcrumbLevel = LogLevel.Debug;
            options.MinimumEventLevel = LogLevel.Warning;
        });
    }

    public static WebApplication UseResearchCruiseAppSentry(this WebApplication app)
    {
        app.UseSentryTracing();
        return app;
    }

    private static double ResolveTracesSampleRate(IConfiguration configuration, IWebHostEnvironment environment)
    {
        var configured = configuration["Sentry:TracesSampleRate"] ?? configuration["SENTRY_TRACES_SAMPLE_RATE"];
        if (double.TryParse(configured, out var parsed))
        {
            return Math.Clamp(parsed, 0, 1);
        }

        return environment.IsProduction() ? 0.1 : environment.IsStaging() ? 0.2 : 1.0;
    }

    private static double ResolveProfilesSampleRate(IConfiguration configuration, IWebHostEnvironment environment)
    {
        var configured = configuration["Sentry:ProfilesSampleRate"];
        if (double.TryParse(configured, out var parsed))
        {
            return Math.Clamp(parsed, 0, 1);
        }

        return environment.IsProduction() ? 0.1 : 0;
    }
}
