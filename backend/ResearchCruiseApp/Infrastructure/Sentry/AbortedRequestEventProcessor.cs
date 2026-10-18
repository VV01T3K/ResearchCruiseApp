using Sentry;
using Sentry.Extensibility;

namespace ResearchCruiseApp.Infrastructure.Sentry;

public sealed class AbortedRequestEventProcessor(IHttpContextAccessor httpContextAccessor)
    : ISentryEventProcessor
{
    public SentryEvent? Process(SentryEvent @event) =>
        IsFromAbortedRequest(@event, httpContextAccessor.HttpContext) ? null : @event;

    internal static bool IsFromAbortedRequest(SentryEvent @event, HttpContext? httpContext) =>
        @event.Exception is not null && httpContext?.RequestAborted.IsCancellationRequested == true;
}
