using System.Data.Common;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using ResearchCruiseApp.Infrastructure.Email;
using ResearchCruiseApp.Infrastructure.Persistence;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class SmtpConfigurationTests
{
    [Theory]
    [InlineData("SmtpServer", "")]
    [InlineData("SmtpServer", "https://smtp.gmail.com")]
    [InlineData("SmtpServer", "smtp.gmail.com:465")]
    [InlineData("SmtpPort", "0")]
    [InlineData("SmtpPort", "65536")]
    [InlineData("SmtpUsername", "")]
    [InlineData("SmtpUsername", "not-a-mailbox")]
    [InlineData("SmtpUsername", "Display <sender@example.com>")]
    [InlineData("SmtpPassword", "")]
    [InlineData("SmtpPassword", "   ")]
    public async Task InvalidRealSmtpSettingsStopTheHostBeforeHostedWorkStarts(
        string key,
        string value
    )
    {
        var configuration = ValidSettings();
        configuration[$"SmtpSettings:{key}"] = value;
        var probe = new StartupProbe();
        using var host = CreateHost(configuration, probe);

        var error = await Assert.ThrowsAsync<OptionsValidationException>(() => host.StartAsync());

        Assert.Contains($"SmtpSettings:{key}", error.Message, StringComparison.Ordinal);
        Assert.DoesNotContain("private-test-password", error.Message, StringComparison.Ordinal);
        Assert.False(probe.Started);
    }

    [Theory]
    [InlineData("smtp.gmail.com", "465")]
    [InlineData("127.0.0.1", "2465")]
    [InlineData("::1", "465")]
    public async Task ValidRealSmtpConfigurationDoesNotNeedAWorkingMailServer(
        string hostName,
        string port
    )
    {
        var settings = ValidSettings();
        settings["SmtpSettings:SmtpServer"] = hostName;
        settings["SmtpSettings:SmtpPort"] = port;
        var probe = new StartupProbe();
        using var host = CreateHost(settings, probe);

        await host.StartAsync();
        Assert.True(probe.Started);
        await host.StopAsync();
    }

    [Fact]
    public async Task FakeSmtpStartsWithoutAnyRealSmtpSettings()
    {
        var settings = new Dictionary<string, string?> { ["SmtpSettings:UseFakeSmtp"] = "true" };
        var probe = new StartupProbe();
        using var host = CreateHost(settings, probe);
        await host.StartAsync();
        Assert.True(probe.Started);
        await host.StopAsync();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("invalid\0path")]
    public async Task FakeSmtpRejectsInvalidOutputPaths(string directory)
    {
        var settings = new Dictionary<string, string?>
        {
            ["SmtpSettings:UseFakeSmtp"] = "true",
            ["SmtpSettings:FakeSmtpDirectory"] = directory,
        };
        var probe = new StartupProbe();
        using var host = CreateHost(settings, probe);
        var error = await Assert.ThrowsAsync<OptionsValidationException>(() => host.StartAsync());
        Assert.Contains("SmtpSettings:FakeSmtpDirectory", error.Message, StringComparison.Ordinal);
        Assert.False(probe.Started);
    }

    [Fact]
    public async Task NonNumericPortFailsAtStartup()
    {
        var settings = ValidSettings();
        settings["SmtpSettings:SmtpPort"] = "not-a-number";
        var probe = new StartupProbe();
        using var host = CreateHost(settings, probe);
        var error = await Assert.ThrowsAsync<InvalidOperationException>(() => host.StartAsync());
        Assert.Contains("SmtpSettings:SmtpPort", error.Message, StringComparison.Ordinal);
        Assert.False(probe.Started);
    }

    [Fact]
    public void ActualApplicationRejectsMissingCredentialsBeforeDatabaseInitialization()
    {
        using var factory = new InvalidSmtpApplicationFactory();
        var error = Assert.Throws<OptionsValidationException>(() => factory.CreateClient());
        Assert.Contains("SmtpSettings:SmtpUsername", error.Message, StringComparison.Ordinal);
        Assert.Contains("SmtpSettings:SmtpPassword", error.Message, StringComparison.Ordinal);
        Assert.False(factory.DatabaseProbe.Opened);
    }

    [Fact]
    public async Task EnvironmentProviderUsesDoubleUnderscoreBackendKeys()
    {
        const string prefix = "RESEARCHCRUISE_SMTP_VALIDATION_TEST_";
        var names = new[] { "SmtpServer", "SmtpPort", "SmtpUsername", "SmtpPassword" };
        var settings = ValidSettings();
        try
        {
            foreach (var name in names)
                Environment.SetEnvironmentVariable(
                    prefix + "SmtpSettings__" + name,
                    settings["SmtpSettings:" + name]
                );
            var builder = Host.CreateApplicationBuilder();
            builder.Configuration.Sources.Clear();
            builder.Configuration.AddEnvironmentVariables(prefix);
            AddValidation(builder.Services, builder.Configuration);
            using var host = builder.Build();
            await host.StartAsync();
            Assert.Equal(
                "sender@example.com",
                host.Services.GetRequiredService<IOptions<SmtpSettings>>().Value.SmtpUsername
            );
            await host.StopAsync();
        }
        finally
        {
            foreach (var name in names)
                Environment.SetEnvironmentVariable(prefix + "SmtpSettings__" + name, null);
        }
    }

    private static Dictionary<string, string?> ValidSettings() =>
        new()
        {
            ["SmtpSettings:SmtpServer"] = "smtp.gmail.com",
            ["SmtpSettings:SmtpPort"] = "465",
            ["SmtpSettings:SmtpUsername"] = "sender@example.com",
            ["SmtpSettings:SmtpPassword"] = "private-test-password",
        };

    private static IHost CreateHost(Dictionary<string, string?> settings, StartupProbe probe)
    {
        var builder = Host.CreateApplicationBuilder();
        builder.Configuration.Sources.Clear();
        builder.Configuration.AddInMemoryCollection(settings);
        AddValidation(builder.Services, builder.Configuration);
        builder.Services.AddSingleton<IHostedService>(probe);
        return builder.Build();
    }

    private static void AddValidation(
        IServiceCollection services,
        ConfigurationManager configuration
    )
    {
        services
            .AddOptions<SmtpSettings>()
            .Bind(configuration.GetSection(SmtpSettings.SectionName))
            .ValidateOnStart();
        services.AddSingleton<IValidateOptions<SmtpSettings>, SmtpSettingsValidator>();
    }

    private sealed class StartupProbe : IHostedService
    {
        public bool Started { get; private set; }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Started = true;
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }

    private sealed class InvalidSmtpApplicationFactory : WebApplicationFactory<Program>
    {
        public DatabaseOpenProbe DatabaseProbe { get; } = new();

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Production");
            builder.ConfigureAppConfiguration(configuration =>
                configuration.AddInMemoryCollection(
                    new Dictionary<string, string?>
                    {
                        ["SmtpSettings:UseFakeSmtp"] = "false",
                        ["SmtpSettings:SmtpUsername"] = "",
                        ["SmtpSettings:SmtpPassword"] = "",
                    }
                )
            );
            builder.ConfigureServices(services =>
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.AddInterceptors(DatabaseProbe)
                )
            );
        }
    }

    private sealed class DatabaseOpenProbe : DbConnectionInterceptor
    {
        public bool Opened { get; private set; }

        public override ValueTask<InterceptionResult> ConnectionOpeningAsync(
            DbConnection connection,
            ConnectionEventData eventData,
            InterceptionResult result,
            CancellationToken cancellationToken = default
        )
        {
            Opened = true;
            throw new InvalidOperationException(
                "SMTP validation should occur before opening a database connection."
            );
        }
    }
}
