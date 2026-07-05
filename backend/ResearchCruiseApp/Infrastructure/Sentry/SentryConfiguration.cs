using System.Globalization;
using System.Reflection;
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
            // An empty DSN disables the SDK; null would make it throw at startup.
            options.Dsn =
                NullIfEmpty(builder.Configuration["Sentry:Dsn"])
                ?? NullIfEmpty(builder.Configuration["SENTRY_DSN_BACKEND"])
                ?? NullIfEmpty(builder.Configuration["SENTRY_DSN"])
                ?? string.Empty;
            options.Environment =
                NullIfEmpty(builder.Configuration["Sentry:Environment"])
                ?? NullIfEmpty(builder.Configuration["SENTRY_ENVIRONMENT"])
                ?? builder.Environment.EnvironmentName;
            options.Release =
                NullIfEmpty(builder.Configuration["Sentry:Release"])
                ?? NullIfEmpty(builder.Configuration["SENTRY_RELEASE"])
                ?? $"research-cruise-app-backend@{ResolveBackendAssemblyVersion()}";

            options.SendDefaultPii = false;
            options.AttachStacktrace = true;
            options.MaxRequestBodySize = RequestSize.Small;
            options.MinimumBreadcrumbLevel = LogLevel.Debug;
            options.MinimumEventLevel = LogLevel.Warning;
            options.EnableLogs = true;

            options.TracesSampleRate = ResolveTracesSampleRate(
                builder.Configuration,
                builder.Environment
            );
            options.ProfilesSampleRate = ResolveProfilesSampleRate(
                builder.Configuration,
                builder.Environment
            );

            options.SetBeforeSend(
                (@event, _) =>
                {
                    if (
                        ContainsSeedUserCredentials(@event.Message?.Formatted)
                        || ContainsSeedUserCredentials(@event.Message?.Message)
                    )
                    {
                        return null;
                    }

                    @event.ServerName = null;
                    return @event;
                }
            );

            options.SetBeforeBreadcrumb(
                (breadcrumb, _) =>
                    ContainsSeedUserCredentials(breadcrumb.Message) ? null : breadcrumb
            );

            options.SetBeforeSendLog(log => ContainsSeedUserCredentials(log.Message) ? null : log);

            options.SetBeforeSendTransaction(
                (transaction, _) =>
                {
                    if (transaction.Name.Contains("/health", StringComparison.OrdinalIgnoreCase))
                    {
                        return null;
                    }

                    return transaction;
                }
            );
        });
    }

    public static WebApplication UseResearchCruiseAppSentry(this WebApplication app)
    {
        app.UseSentryTracing();
        return app;
    }

    private static double ResolveTracesSampleRate(
        IConfiguration configuration,
        IWebHostEnvironment environment
    )
    {
        var configured =
            configuration["Sentry:TracesSampleRate"] ?? configuration["SENTRY_TRACES_SAMPLE_RATE"];
        if (
            double.TryParse(
                configured,
                NumberStyles.Float,
                CultureInfo.InvariantCulture,
                out var parsed
            )
        )
        {
            return Math.Clamp(parsed, 0, 1);
        }

        return environment.IsProduction() ? 0.1
            : environment.IsStaging() ? 0.2
            : 1.0;
    }

    private static double ResolveProfilesSampleRate(
        IConfiguration configuration,
        IWebHostEnvironment environment
    )
    {
        var configured =
            configuration["Sentry:ProfilesSampleRate"]
            ?? configuration["SENTRY_PROFILES_SAMPLE_RATE"];
        if (
            double.TryParse(
                configured,
                NumberStyles.Float,
                CultureInfo.InvariantCulture,
                out var parsed
            )
        )
        {
            return Math.Clamp(parsed, 0, 1);
        }

        return environment.IsProduction() ? 0.1 : 0;
    }

    // Seed user passwords are logged on purpose for local dev convenience
    // (Database:LogUserPasswordsWhenSeeding) and must never leave the machine.
    private static bool ContainsSeedUserCredentials(string? message) =>
        message?.Contains("Seed User Created", StringComparison.OrdinalIgnoreCase) ?? false;

    private static string? NullIfEmpty(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value;

    private static string ResolveBackendAssemblyVersion()
    {
        var assembly = typeof(SentryConfiguration).Assembly;
        return assembly
                .GetCustomAttribute<AssemblyInformationalVersionAttribute>()
                ?.InformationalVersion
            ?? assembly.GetName().Version?.ToString()
            ?? "unknown";
    }
}
