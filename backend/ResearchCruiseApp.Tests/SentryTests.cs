using System.Security.Claims;
using ResearchCruiseApp.Infrastructure.Sentry;
using Sentry;
using Sentry.Protocol;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class SentryTests
{
    [Fact]
    public void ScrubsSensitiveRequestDataAndClientIp()
    {
        var @event = new SentryEvent
        {
            User = new SentryUser { IpAddress = "192.0.2.1" },
            Request = new SentryRequest
            {
                Cookies = "session=secret",
                Headers =
                {
                    ["Authorization"] = "Bearer secret",
                    ["Proxy-Authorization"] = "secret",
                    ["Cookie"] = "session=secret",
                    ["Set-Cookie"] = "session=secret",
                    ["x-api-key"] = "secret",
                    ["Accept"] = "application/json",
                },
            },
        };

        SentryConfiguration.ScrubSensitiveData(@event);

        Assert.Null(@event.User.IpAddress);
        Assert.Null(@event.Request.Cookies);
        Assert.DoesNotContain("Authorization", @event.Request.Headers.Keys);
        Assert.DoesNotContain("Proxy-Authorization", @event.Request.Headers.Keys);
        Assert.DoesNotContain("Cookie", @event.Request.Headers.Keys);
        Assert.DoesNotContain("Set-Cookie", @event.Request.Headers.Keys);
        Assert.DoesNotContain("x-api-key", @event.Request.Headers.Keys);
        Assert.Equal("application/json", @event.Request.Headers["Accept"]);
    }

    [Theory]
    [InlineData("GET /health")]
    [InlineData("GET /HEALTH")]
    public void FiltersHealthTransactions(string transactionName)
    {
        Assert.True(SentryConfiguration.IsHealthTransaction(transactionName));
        Assert.False(SentryConfiguration.IsHealthTransaction("GET /v2/cruises"));
    }

    [Fact]
    public void EnrichesUserAndRoleDiagnostics()
    {
        var principal = new ClaimsPrincipal(
            new ClaimsIdentity(
                [
                    new Claim(ClaimTypes.NameIdentifier, "user-123"),
                    new Claim(ClaimTypes.Role, "Administrator"),
                    new Claim(ClaimTypes.Role, "CruiseManager"),
                ],
                "test"
            )
        );
        var scope = new Scope(new SentryOptions());

        SentryUserMiddleware.EnrichScope(scope, principal);

        Assert.Equal("user-123", scope.User.Id);
        Assert.Equal("Administrator,CruiseManager", scope.User.Other["roles"]);
        Assert.Equal("Administrator,CruiseManager", scope.Tags["user.roles"]);
        Assert.Equal("True", scope.Tags["user.multiple_roles"]);
    }
}
