using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Sentry.Extensibility;
using Sentry.Extensions.Logging;
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

    // Auth request fields and email-link query parameters that carry passwords or one-time codes.
    private static readonly string[] SecretFields =
    [
        "password",
        "newPassword",
        "passwordConfirm",
        "resetCode",
        "code",
        "supervisorCode",
    ];

    private static readonly Regex SecretParameters = new(
        $@"\b((?:{string.Join('|', SecretFields)})=)[^&#\s]*",
        RegexOptions.IgnoreCase | RegexOptions.Compiled
    );

    private static readonly JsonSerializerOptions BodyJsonOptions = new()
    {
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
    };

    private const string Filtered = "[Filtered]";

    public static void AddResearchCruiseAppSentry(this WebApplicationBuilder builder)
    {
        builder.Services.AddSingleton<ISentryEventProcessor, AbortedRequestEventProcessor>();
        builder.WebHost.UseSentry(options =>
        {
            options.SendDefaultPii = true;
            options.MaxRequestBodySize = RequestSize.Always;
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

    internal static Breadcrumb ScrubBreadcrumb(Breadcrumb breadcrumb) =>
        new(
            ScrubSecrets(breadcrumb.Message)!,
            breadcrumb.Type!,
            breadcrumb.Data?.ToDictionary(pair => pair.Key, pair => ScrubSecrets(pair.Value)!),
            breadcrumb.Category,
            breadcrumb.Level
        );

    private static string? ScrubSecrets(string? value) =>
        value is null ? null : SecretParameters.Replace(value, "$1" + Filtered);

    private static void ScrubJson(JsonNode? node)
    {
        if (node is JsonArray array)
        {
            foreach (var item in array)
                ScrubJson(item);
        }
        else if (node is JsonObject obj)
        {
            foreach (var (key, value) in obj.ToArray())
            {
                if (SecretFields.Contains(key, StringComparer.OrdinalIgnoreCase))
                    obj[key] = Filtered;
                else
                    ScrubJson(value);
            }
        }
    }

    internal static void ScrubSensitiveData(SentryRequest request, SentryUser? user)
    {
        // Never send the client IP address.
        if (user is not null)
        {
            user.IpAddress = null;
        }

        request.Url = ScrubSecrets(request.Url);
        request.QueryString = ScrubSecrets(request.QueryString);
        if (request.Data is string body)
        {
            try
            {
                var json = JsonNode.Parse(body);
                ScrubJson(json);
                request.Data = json?.ToJsonString(BodyJsonOptions);
            }
            catch (JsonException)
            {
                request.Data = ScrubSecrets(body);
            }
        }

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
