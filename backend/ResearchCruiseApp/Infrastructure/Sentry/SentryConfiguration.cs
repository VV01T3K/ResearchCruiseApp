using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Sentry.Extensibility;
using Sentry.Extensions.Logging;
using Sentry.Protocol;

namespace ResearchCruiseApp.Infrastructure.Sentry;

public static class SentryConfiguration
{
    // The SDK already filters Authorization and, without default PII, skips cookies.
    private static readonly string[] SensitiveHeaders = ["Set-Cookie", "X-Api-Key"];

    // Email-link query parameters that carry one-time codes.
    private static readonly string[] SecretParameters = ["code", "resetCode", "supervisorCode"];

    private static readonly string[] SecretBreadcrumbKeys =
    [
        .. SecretParameters,
        "password",
        "newPassword",
        "passwordConfirm",
    ];

    // Routes whose request body carries a password or one-time code.
    private static readonly Regex SecretBodyRoute = new(
        @"/(?:auth/(?:login|register|password-reset)|users/me/password|supervisor-review/decision)/?(?:[?#]|$)",
        RegexOptions.IgnoreCase | RegexOptions.Compiled
    );

    private static readonly Regex QueryString = new(@"\?[^\s#""'<>]*", RegexOptions.Compiled);

    private const string Filtered = "[Filtered]";

    public static void AddResearchCruiseAppSentry(this WebApplicationBuilder builder)
    {
        builder.Services.AddSingleton<ISentryEventProcessor, AbortedRequestEventProcessor>();
        builder.WebHost.UseSentry(options =>
        {
            options.SendDefaultPii = false;
            options.MaxRequestBodySize = RequestSize.Always;
            options.IgnoreTransactions.Add(new Regex("(?i)/health$"));
            // EF logs failed commands without the exception; real failures reach Sentry as exceptions, expected conflicts become 409s.
            options.AddLogEntryFilter(
                (_, _, eventId, _) => eventId.Name == RelationalEventId.CommandError.Name
            );

            options.SetBeforeBreadcrumb(ScrubBreadcrumb);
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
                    ScrubSensitiveData(transaction.Request, transaction.User);
                    return transaction;
                }
            );
        });
    }

    internal static void ScrubSensitiveData(SentryEvent @event)
    {
        foreach (var exception in @event.SentryExceptions ?? [])
            exception.Value = FilterQueries(exception.Value);
        if (@event.Message is not null)
        {
            @event.Message.Message = FilterQueries(@event.Message.Message);
            @event.Message.Formatted = FilterQueries(@event.Message.Formatted);
        }
        ScrubSensitiveData(@event.Request, @event.User);
    }

    internal static Breadcrumb ScrubBreadcrumb(Breadcrumb breadcrumb) =>
        new(
            FilterQueries(breadcrumb.Message)!,
            breadcrumb.Type!,
            breadcrumb.Data?.ToDictionary(
                pair => pair.Key,
                pair =>
                    SecretBreadcrumbKeys.Contains(pair.Key, StringComparer.OrdinalIgnoreCase)
                        ? Filtered
                        : FilterQueries(pair.Value)!
            ),
            breadcrumb.Category,
            breadcrumb.Level
        );

    private static string? FilterQueries(string? value)
    {
        if (value is null)
            return null;
        try
        {
            return QueryString.Replace(
                value,
                query =>
                    "?"
                    + string.Join(
                        '&',
                        query
                            .Value[1..]
                            .Split('&')
                            .Select(parameter =>
                            {
                                var name = parameter.Split('=')[0];
                                return SecretParameters.Contains(
                                    Uri.UnescapeDataString(name.Replace('+', ' ')),
                                    StringComparer.OrdinalIgnoreCase
                                )
                                    ? $"{name}={Filtered}"
                                    : parameter;
                            })
                    )
            );
        }
        catch
        {
            return Filtered;
        }
    }

    internal static void ScrubSensitiveData(SentryRequest request, SentryUser? user)
    {
        // Never send the client IP address.
        if (user is not null)
        {
            user.IpAddress = null;
        }

        if (request.Url is not null && SecretBodyRoute.IsMatch(request.Url))
            request.Data = Filtered;
        request.Url = FilterQueries(request.Url);
        request.QueryString = FilterQueries(request.QueryString);
        foreach (
            var key in request
                .Headers.Keys.Where(key =>
                    key.Equals("Referer", StringComparison.OrdinalIgnoreCase)
                )
                .ToArray()
        )
            request.Headers[key] = FilterQueries(request.Headers[key])!;

        request.Env.Remove("SERVER_NAME");

        var sensitiveKeys = request.Headers.Keys.Where(key =>
            SensitiveHeaders.Contains(key, StringComparer.OrdinalIgnoreCase)
        );
        foreach (var header in sensitiveKeys.ToArray())
        {
            request.Headers.Remove(header);
        }
    }
}
