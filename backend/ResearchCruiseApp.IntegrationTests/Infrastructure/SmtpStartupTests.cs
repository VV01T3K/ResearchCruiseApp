using System.Data.Common;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.IntegrationTests.Infrastructure;

public sealed class SmtpStartupTests
{
    [Fact]
    public async Task Start_WhenSmtpCredentialsAreMissing_FailsBeforeOpeningDatabase()
    {
        await using var app = new TestApplication(
            "Server=127.0.0.1,1;Database=NeverOpened;User ID=synthetic;Password=synthetic-db-secret;TrustServerCertificate=true;Connect Timeout=1",
            "Production"
        );
        var probe = new DatabaseOpenProbe();
        await using var invalid = app.WithWebHostBuilder(builder =>
            builder.ConfigureServices(
                (context, services) =>
                {
                    context.Configuration["SmtpSettings:SmtpUsername"] = "";
                    context.Configuration["SmtpSettings:SmtpPassword"] = "";
                    services.AddDbContext<ApplicationDbContext>(options =>
                        options.AddInterceptors(probe)
                    );
                }
            )
        );
        var error = Assert.Throws<OptionsValidationException>(() => invalid.CreateClient());
        Assert.Contains("SmtpSettings:SmtpUsername", error.Message, StringComparison.Ordinal);
        Assert.Contains("SmtpSettings:SmtpPassword", error.Message, StringComparison.Ordinal);
        Assert.DoesNotContain("SyntheticPassword", error.Message, StringComparison.Ordinal);
        Assert.DoesNotContain("synthetic-db-secret", error.Message, StringComparison.Ordinal);
        Assert.False(probe.Opened);
    }

    private sealed class DatabaseOpenProbe : DbConnectionInterceptor
    {
        internal bool Opened { get; private set; }

        public override InterceptionResult ConnectionOpening(
            DbConnection connection,
            ConnectionEventData eventData,
            InterceptionResult result
        )
        {
            Opened = true;
            throw new InvalidOperationException("Database opened before SMTP validation.");
        }

        public override ValueTask<InterceptionResult> ConnectionOpeningAsync(
            DbConnection connection,
            ConnectionEventData eventData,
            InterceptionResult result,
            CancellationToken cancellationToken = default
        )
        {
            Opened = true;
            throw new InvalidOperationException("Database opened before SMTP validation.");
        }
    }
}
