using ResearchCruiseApp.Infrastructure.Sentry;
using Sentry;

namespace ResearchCruiseApp.UnitTests.Infrastructure;

public sealed class SentryScrubbingTests
{
    [Fact]
    public void ScrubSensitiveData_RemovesSecretsAndKeepsEverythingElse()
    {
        var login = new SentryEvent
        {
            User = new SentryUser { Id = "user-1", IpAddress = "10.0.0.1" },
            Request = new SentryRequest
            {
                Url = "https://app.test/api/auth/login",
                Data = """{"email":"a@example.test","Password":"pw-secret"}""",
                Headers = { ["Authorization"] = "Bearer token-secret" },
            },
        };
        var reset = new SentryTransaction("POST /api/auth/password-reset", "http.server")
        {
            Request = new SentryRequest
            {
                Url = "https://app.test/api/auth/confirm-email?userId=u1&code=code-secret",
                QueryString = "?userId=u1&code=code-secret",
                Data =
                    """{"emailBase64":"YUBi","resetCode":"reset-secret","password":"pw-secret","passwordConfirm":"pw-secret","form":{"title":"Rejs łódź","nested":[{"newPassword":"pw-secret"}]}}""",
            },
        };

        SentryConfiguration.ScrubSensitiveData(login);
        SentryConfiguration.ScrubSensitiveData(reset.Request, reset.User);
        var breadcrumb = SentryConfiguration.ScrubBreadcrumb(
            new Breadcrumb(
                "Request starting GET /api/applications/a1/supervisor-review?code=code-secret",
                "default",
                new Dictionary<string, string>
                {
                    ["url"] = "/cruise-approval?supervisorCode=code-secret&cruiseApplicationId=a1",
                }
            )
        );

        var sent = string.Join(
            "\n",
            login.Request.Data,
            login.Request.Headers.Count,
            login.User.IpAddress,
            reset.Request.Url,
            reset.Request.QueryString,
            reset.Request.Data,
            breadcrumb.Message,
            breadcrumb.Data!["url"]
        );
        Assert.DoesNotContain("secret", sent);
        Assert.Contains("a@example.test", sent);
        Assert.Contains("userId=u1", sent);
        Assert.Contains("cruiseApplicationId=a1", sent);
        Assert.Contains("""{"title":"Rejs łódź","nested":[{"newPassword":"[Filtered]"}]}""", sent);
        Assert.Equal("user-1", login.User.Id);
    }
}
