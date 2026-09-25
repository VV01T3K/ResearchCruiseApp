using System.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using ResearchCruiseApp.Infrastructure.Email;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.IntegrationTests.Infrastructure;

internal sealed class TestApplication(string connectionString) : WebApplicationFactory<Program>
{
    internal CapturingEmailTransport Transport { get; } = new();
    internal ControlledClock Clock { get; } = new();

    protected override IHost CreateHost(IHostBuilder builder)
    {
        var elapsed = Stopwatch.StartNew();
        var host = base.CreateHost(builder);
        Console.WriteLine($"Application host: {elapsed.Elapsed.TotalMilliseconds:F0} ms");
        return host;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        var settings = new Dictionary<string, string>
        {
            ["ConnectionStrings:Database"] = connectionString,
            ["Database:SeedAccountsAutomatically"] = "false",
            ["Database:LogUserPasswordsWhenSeeding"] = "false",
            ["JWT:ValidIssuer"] = "https://tests.invalid",
            ["JWT:ValidAudience"] = "https://tests.invalid",
            ["JWT:Secret"] = "SyntheticTestSigningKeyWithAtLeastThirtyTwoBytes!",
            ["JWT:AccessTokenLifetimeSeconds"] = "900",
            ["JWT:RefreshTokenLifetimeSeconds"] = "7200",
            ["SmtpSettings:UseFakeSmtp"] = "false",
            ["SmtpSettings:SmtpServer"] = "smtp.example.invalid",
            ["SmtpSettings:SmtpPort"] = "465",
            ["SmtpSettings:SmtpUsername"] = "sender@example.invalid",
            ["SmtpSettings:SmtpPassword"] = "SyntheticPassword",
            ["FrontendUrl"] = "https://tests.invalid",
            ["Sentry:Dsn"] = "",
            ["Logging:LogLevel:Default"] = "Warning",
        };
        foreach (var (key, value) in settings)
            builder.UseSetting(key, value);

        builder.ConfigureServices(
            (context, services) =>
            {
                // Program adds environment variables again before Build. Reapply isolation
                // settings before services start, without replacing production DB registration.
                foreach (var (key, value) in settings)
                    context.Configuration[key] = value;
                var worker = services.Single(descriptor =>
                    descriptor.ImplementationType == typeof(EmailOutboxWorker)
                );
                services.Remove(worker);
                services.RemoveAll<IEmailTransport>();
                services.AddSingleton<IEmailTransport>(Transport);
                services.RemoveAll<TimeProvider>();
                services.AddSingleton<TimeProvider>(Clock);
            }
        );
    }

    internal HttpClient CreateApiClient() =>
        CreateClient(
            new WebApplicationFactoryClientOptions
            {
                BaseAddress = new Uri("https://localhost"),
                AllowAutoRedirect = false,
                HandleCookies = false,
            }
        );

    internal async Task InDatabase(Func<ApplicationDbContext, Task> action)
    {
        await using var scope = Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var expected = new SqlConnectionStringBuilder(connectionString);
        var actual = db.Database.GetDbConnection();
        if (
            !db.Database.IsSqlServer()
            || actual.Database != expected.InitialCatalog
            || actual.DataSource != expected.DataSource
        )
            throw new InvalidOperationException(
                "Application did not resolve the fixture SQL database."
            );
        await action(db);
    }

    internal async Task Enqueue(string recipient, string subject, string body)
    {
        await using var scope = Services.CreateAsyncScope();
        await scope
            .ServiceProvider.GetRequiredService<EmailOutbox>()
            .Enqueue(recipient, subject, body);
    }

    internal async Task Dispatch(CancellationToken cancellationToken)
    {
        await using var scope = Services.CreateAsyncScope();
        await scope
            .ServiceProvider.GetRequiredService<EmailOutboxDispatcher>()
            .DispatchBatch(cancellationToken);
    }
}

internal sealed class CapturingEmailTransport : IEmailTransport
{
    internal List<(Guid Id, EmailPayload Payload)> Messages { get; } = [];

    internal Func<Guid, EmailPayload, CancellationToken, Task>? OnDeliver { get; set; }

    public Task Deliver(Guid id, EmailPayload payload, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        Messages.Add((id, payload));
        return OnDeliver?.Invoke(id, payload, cancellationToken) ?? Task.CompletedTask;
    }
}

internal sealed class ControlledClock : TimeProvider
{
    private DateTimeOffset _now = new(2030, 1, 15, 12, 0, 0, TimeSpan.Zero);

    public override DateTimeOffset GetUtcNow() => _now;

    internal void Advance(TimeSpan duration) => _now += duration;
}
