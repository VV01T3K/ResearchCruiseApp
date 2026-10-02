using System.Collections.Concurrent;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.IntegrationTests.Auth;
using Sentry;
using Sentry.AspNetCore;
using Sentry.Extensibility;
using Sentry.Protocol;
using Sentry.Protocol.Envelopes;

namespace ResearchCruiseApp.IntegrationTests.Infrastructure;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class SentryTelemetryTests(SqlFixture fixture) : IAsyncLifetime
{
    private static readonly string[] SensitiveHeaderNames =
    [
        "Authorization",
        "Proxy-Authorization",
        "Cookie",
        "Set-Cookie",
        "x-api-key",
    ];

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync()
    {
        Assert.False(SentrySdk.IsEnabled);
        await fixture.ResetAsync();
    }

    // BE-INFRA-004: production middleware/callbacks sanitize the real emitted event.
    [Fact]
    public async Task Capture_WhenAuthenticatedWriteFails_EmitsSafeUserAndRoleDiagnostics()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, CruiseApplicationStatus.FormBRequired);
        string userId;
        await using (var scope = app.Services.CreateAsyncScope())
        {
            var users = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var user = await users.FindByEmailAsync(application.OwnerEmail);
            Assert.NotNull(user);
            userId = user.Id;
            var roles = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            Assert.True(
                (await roles.CreateAsync(new IdentityRole(RoleName.Administrator))).Succeeded
            );
            Assert.True((await users.AddToRoleAsync(user, RoleName.Administrator)).Succeeded);
        }
        await app.InDatabase(db =>
            db.Database.ExecuteSqlRawAsync(
                "ALTER TABLE [FormsB] ADD CONSTRAINT [CK_Sentry_Test] CHECK ([IsCruiseManagerPresent] <> N'capture-failure')",
                ct
            )
        );
        try
        {
            var transport = new CapturingSentryTransport();
            await using var telemetry = EnableTelemetry(app, transport);
            using var client = telemetry.CreateClient(
                new WebApplicationFactoryClientOptions
                {
                    BaseAddress = new Uri("https://localhost"),
                    HandleCookies = false,
                }
            );
            var session = await RefreshSessionTests.Login(client, application.OwnerEmail);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                "Bearer",
                session.Access
            );
            client.DefaultRequestHeaders.Add("Proxy-Authorization", "proxy-secret");
            client.DefaultRequestHeaders.Add("Cookie", "session=cookie-secret");
            client.DefaultRequestHeaders.Add("Set-Cookie", "session=set-cookie-secret");
            client.DefaultRequestHeaders.Add("X-Api-Key", "api-key-secret");
            client.DefaultRequestHeaders.Accept.ParseAdd("application/json");
            using var response = await client.PutAsJsonAsync(
                $"/v2/applications/{application.Id}/form-b",
                new FormBWriteRequest
                {
                    Form = new FormBFields { IsCruiseManagerPresent = "capture-failure" },
                    Draft = true,
                },
                ct
            );
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
            Assert.Equal(
                "application/problem+json",
                response.Content.Headers.ContentType?.MediaType
            );
            var hub = telemetry.Services.GetRequiredService<IHub>();
            Assert.True(hub.IsEnabled);
            await hub.FlushAsync(TimeSpan.FromSeconds(10));
            var events = transport
                .Payloads()
                .Where(payload => payload.TryGetProperty("exception", out _))
                .ToList();
            var captured = Assert.Single(events);
            Assert.Equal(userId, captured.GetProperty("user").GetProperty("id").GetString());
            var rolesText = captured.GetProperty("tags").GetProperty("user.roles").GetString();
            Assert.Equal(
                new[] { RoleName.Administrator, RoleName.CruiseManager },
                rolesText!.Split(',').Order()
            );
            Assert.Equal(
                rolesText,
                captured.GetProperty("user").GetProperty("other").GetProperty("roles").GetString()
            );
            Assert.Equal(
                "True",
                captured.GetProperty("tags").GetProperty("user.multiple_roles").GetString()
            );
            Assert.False(
                string.IsNullOrWhiteSpace(
                    captured.GetProperty("tags").GetProperty("error.code").GetString()
                )
            );
            Assert.False(captured.TryGetProperty("server_name", out _));
            Assert.False(captured.GetProperty("user").TryGetProperty("ip_address", out _));
            var request = captured.GetProperty("request");
            Assert.False(request.TryGetProperty("cookies", out _));
            var headers = request.GetProperty("headers");
            Assert.Contains(
                headers.EnumerateObject(),
                header =>
                    header.Name.Equals("Accept", StringComparison.OrdinalIgnoreCase)
                    && header.Value.GetString() == "application/json"
            );
            foreach (
                var name in new[]
                {
                    "Authorization",
                    "Proxy-Authorization",
                    "Cookie",
                    "Set-Cookie",
                    "X-Api-Key",
                }
            )
                Assert.DoesNotContain(
                    headers.EnumerateObject(),
                    header => header.Name.Equals(name, StringComparison.OrdinalIgnoreCase)
                );
            var raw = captured.GetRawText();
            foreach (
                var secret in new[]
                {
                    session.Access,
                    session.Cookie,
                    "proxy-secret",
                    "cookie-secret",
                    "set-cookie-secret",
                    "api-key-secret",
                }
            )
                Assert.DoesNotContain(secret, raw, StringComparison.Ordinal);
            await app.InDatabase(async db =>
            {
                Assert.Empty(await db.FormsB.ToListAsync(ct));
                Assert.Equal(
                    CruiseApplicationStatus.FormBRequired,
                    (await db.CruiseApplications.SingleAsync(ct)).Status
                );
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            });
            Assert.Empty(app.Transport.Messages);
        }
        finally
        {
            await app.InDatabase(db =>
                db.Database.ExecuteSqlRawAsync(
                    "ALTER TABLE [FormsB] DROP CONSTRAINT [CK_Sentry_Test]",
                    CancellationToken.None
                )
            );
        }
    }

    // BE-INFRA-005: exercise the registered SDK callback, including a sent control.
    [Theory]
    [InlineData("GET /health")]
    [InlineData("GET /HEALTH")]
    public async Task Trace_WhenHealthTransactionFinishes_EmitsOnlyNonHealthControl(string name)
    {
        await using var app = new TestApplication(fixture.ConnectionString);
        var transport = new CapturingSentryTransport();
        await using var telemetry = EnableTelemetry(app, transport);
        var hub = telemetry.Services.GetRequiredService<IHub>();
        Assert.True(hub.IsEnabled);
        // BE-INFRA-006: the non-health control also proves transaction privacy.
        hub.ConfigureScope(scope =>
        {
            scope.User = new SentryUser { Id = "trace-user", IpAddress = "192.0.2.1" };
            scope.Request.Cookies = "session=trace-cookie-secret";
            foreach (var header in SensitiveHeaderNames)
                scope.Request.Headers[header] = "trace-header-secret";
            scope.Request.Headers["Accept"] = "application/json";
        });
        hub.StartTransaction(name, "http.server").Finish();
        hub.StartTransaction("GET /v2/cruises", "http.server").Finish();
        await hub.FlushAsync(TimeSpan.FromSeconds(10));
        var transaction = Assert.Single(
            transport.Payloads(),
            payload => payload.TryGetProperty("transaction", out _)
        );
        Assert.Equal("GET /v2/cruises", transaction.GetProperty("transaction").GetString());
        Assert.False(transaction.GetProperty("user").TryGetProperty("ip_address", out _));
        var request = transaction.GetProperty("request");
        Assert.False(request.TryGetProperty("cookies", out _));
        var headers = request.GetProperty("headers");
        Assert.Equal("application/json", headers.GetProperty("Accept").GetString());
        Assert.Single(headers.EnumerateObject());
        Assert.DoesNotContain(
            "trace-header-secret",
            transaction.GetRawText(),
            StringComparison.Ordinal
        );
        Assert.DoesNotContain(
            "trace-cookie-secret",
            transaction.GetRawText(),
            StringComparison.Ordinal
        );
        Assert.Empty(app.Transport.Messages);
    }

    private static WebApplicationFactory<Program> EnableTelemetry(
        TestApplication app,
        CapturingSentryTransport transport
    ) =>
        app.WithWebHostBuilder(builder =>
            builder.ConfigureServices(services =>
                services.PostConfigure<SentryAspNetCoreOptions>(options =>
                {
                    options.Dsn = "https://synthetic@telemetry.invalid/1";
                    options.Transport = transport;
                    options.TracesSampleRate = 1;
                    options.AutoSessionTracking = false;
                    options.SendClientReports = false;
                    options.MinimumEventLevel = LogLevel.Critical;
                })
            )
        );

    private sealed class CapturingSentryTransport : ITransport
    {
        private readonly ConcurrentQueue<string> _envelopes = new();

        public async Task SendEnvelopeAsync(
            Envelope envelope,
            CancellationToken cancellationToken = default
        )
        {
            using var stream = new MemoryStream();
            await envelope.SerializeAsync(stream, null, cancellationToken);
            _envelopes.Enqueue(Encoding.UTF8.GetString(stream.ToArray()));
        }

        internal IEnumerable<JsonElement> Payloads()
        {
            foreach (var envelope in _envelopes)
            foreach (var line in envelope.Split('\n', StringSplitOptions.RemoveEmptyEntries))
            {
                using var json = JsonDocument.Parse(line);
                yield return json.RootElement.Clone();
            }
        }
    }
}
