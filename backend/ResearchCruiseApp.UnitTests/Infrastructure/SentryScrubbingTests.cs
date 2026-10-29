using ResearchCruiseApp.Infrastructure.Sentry;
using Sentry;
using Sentry.Protocol;

namespace ResearchCruiseApp.UnitTests.Infrastructure;

public sealed class SentryScrubbingTests
{
    [Fact]
    public void ScrubSensitiveData_RemovesSecretsAndKeepsEverythingElse()
    {
        const string formBody = """{ "title": "Rejs łódź", "code":"SPUB-2026", "x": null }""";
        var login = new SentryEvent
        {
            User = new SentryUser { Id = "user-1", IpAddress = "10.0.0.1" },
            Request = new SentryRequest
            {
                Url = "https://app.test/api/v2/auth/login",
                Data = new Dictionary<string, string>
                {
                    ["email"] = "a@example.test",
                    ["password"] = "pw-secret",
                },
                Headers =
                {
                    ["X-Api-Key"] = "api-key-secret",
                    ["referer"] = "https://app.test/confirm-email?userId=u1&code=code-secret",
                },
            },
            SentryExceptions =
            [
                new SentryException { Value = "GET /x?%63ode=code-secret failed: code=SPUB-2026" },
            ],
        };
        var form = new SentryEvent
        {
            Request = new SentryRequest
            {
                Url = "https://app.test/api/v2/applications/a1/form-a",
                Data = formBody,
            },
        };
        var reset = new SentryTransaction("POST /api/v2/auth/password-reset", "http.server")
        {
            Request = new SentryRequest
            {
                Url = "https://app.test/api/v2/auth/password-reset",
                Data =
                    """{"password":"pw-secret","password":"pw-secret","resetCode":"reset-secret""",
            },
        };
        var confirm = new SentryTransaction("GET /api/v2/auth/confirm-email", "http.server")
        {
            Request = new SentryRequest
            {
                Url = "https://app.test/api/v2/auth/confirm-email",
                QueryString = "?userId=u1&code=code-secret",
            },
        };

        SentryConfiguration.ScrubSensitiveData(login);
        SentryConfiguration.ScrubSensitiveData(form);
        SentryConfiguration.ScrubSensitiveData(reset.Request, reset.User);
        SentryConfiguration.ScrubSensitiveData(confirm.Request, confirm.User);
        var breadcrumb = SentryConfiguration.ScrubBreadcrumb(
            new Breadcrumb(
                "Request starting GET /api/v2/applications/a1/supervisor-review?code=code-secret - -",
                "default",
                new Dictionary<string, string>
                {
                    ["code"] = "code-secret",
                    ["url"] = "/cruise-approval?supervisorCode=code-secret&cruiseApplicationId=a1",
                }
            )
        );

        var sent = string.Join(
            "\n",
            login.Request.Data,
            string.Join(",", login.Request.Headers),
            login.User.IpAddress,
            login.SentryExceptions!.Single().Value,
            reset.Request.Data,
            confirm.Request.QueryString,
            breadcrumb.Message,
            string.Join(",", breadcrumb.Data!)
        );
        Assert.DoesNotContain("secret", sent);
        Assert.Contains("userId=u1", sent);
        Assert.Contains("cruiseApplicationId=a1", sent);
        Assert.Contains("failed: code=SPUB-2026", sent);
        Assert.Same(formBody, form.Request.Data);
        Assert.Equal("user-1", login.User.Id);
    }
}
