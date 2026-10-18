using Microsoft.AspNetCore.Http;
using ResearchCruiseApp.Infrastructure.Sentry;
using Sentry;

namespace ResearchCruiseApp.UnitTests.Infrastructure;

public sealed class AbortedRequestEventProcessorTests
{
    [Theory]
    [InlineData(true, true)]
    [InlineData(false, false)]
    public void IsFromAbortedRequest_DropsOnlyExceptionsFromAbortedRequests(
        bool aborted,
        bool expected
    )
    {
        using var abort = new CancellationTokenSource();
        if (aborted)
            abort.Cancel();
        var httpContext = new DefaultHttpContext { RequestAborted = abort.Token };
        var @event = new SentryEvent(
            new InvalidOperationException("transient failure", new TimeoutException())
        );

        Assert.Equal(
            expected,
            AbortedRequestEventProcessor.IsFromAbortedRequest(@event, httpContext)
        );
    }
}
