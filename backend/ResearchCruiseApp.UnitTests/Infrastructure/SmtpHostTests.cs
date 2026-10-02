using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using ResearchCruiseApp.Infrastructure.Email;

namespace ResearchCruiseApp.UnitTests.Infrastructure;

public sealed class SmtpHostTests
{
    // BE-SMTP-003: independently reviewed native binding/startup candidates; legacy execution remains.
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
    public async Task Start_WhenRealSettingsAreInvalid_RejectsBeforeHostedWork(
        string key,
        string value
    )
    {
        var configuration = ValidSettings();
        configuration[$"SmtpSettings:{key}"] = value;
        var probe = new StartupProbe();
        using var host = CreateHost(configuration, probe);

        var error = await Assert.ThrowsAsync<OptionsValidationException>(() =>
            host.StartAsync(TestContext.Current.CancellationToken)
        );

        Assert.Contains($"SmtpSettings:{key}", error.Message, StringComparison.Ordinal);
        Assert.DoesNotContain("private-test-password", error.Message, StringComparison.Ordinal);
        Assert.False(probe.Started);
    }

    [Theory]
    [InlineData("smtp.gmail.com", "465")]
    [InlineData("127.0.0.1", "2465")]
    [InlineData("::1", "465")]
    public async Task Start_WhenRealSettingsAreValid_RequiresNoMailConnection(
        string hostName,
        string port
    )
    {
        var settings = ValidSettings();
        settings["SmtpSettings:SmtpServer"] = hostName;
        settings["SmtpSettings:SmtpPort"] = port;
        var probe = new StartupProbe();
        using var host = CreateHost(settings, probe);

        await host.StartAsync(TestContext.Current.CancellationToken);
        Assert.True(probe.Started);
        var bound = host.Services.GetRequiredService<IOptions<SmtpSettings>>().Value;
        Assert.Equal(hostName, bound.SmtpServer);
        Assert.Equal(
            int.Parse(port, System.Globalization.CultureInfo.InvariantCulture),
            bound.SmtpPort
        );
        await host.StopAsync(TestContext.Current.CancellationToken);
    }

    [Fact]
    public async Task Start_WhenFakeDeliveryUsesDefaults_RequiresNoRealCredentials()
    {
        var settings = new Dictionary<string, string?> { ["SmtpSettings:UseFakeSmtp"] = "true" };
        var probe = new StartupProbe();
        using var host = CreateHost(settings, probe);
        await host.StartAsync(TestContext.Current.CancellationToken);
        Assert.True(probe.Started);
        var bound = host.Services.GetRequiredService<IOptions<SmtpSettings>>().Value;
        Assert.True(bound.UseFakeSmtp);
        Assert.Equal("fake-emails", bound.FakeSmtpDirectory);
        Assert.Empty(bound.SmtpUsername);
        Assert.Empty(bound.SmtpPassword);
        await host.StopAsync(TestContext.Current.CancellationToken);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("invalid\0path")]
    public async Task Start_WhenFakeDirectoryIsInvalid_RejectsBeforeHostedWork(string directory)
    {
        var settings = new Dictionary<string, string?>
        {
            ["SmtpSettings:UseFakeSmtp"] = "true",
            ["SmtpSettings:FakeSmtpDirectory"] = directory,
        };
        var probe = new StartupProbe();
        using var host = CreateHost(settings, probe);
        var error = await Assert.ThrowsAsync<OptionsValidationException>(() =>
            host.StartAsync(TestContext.Current.CancellationToken)
        );
        Assert.Contains("SmtpSettings:FakeSmtpDirectory", error.Message, StringComparison.Ordinal);
        Assert.False(probe.Started);
    }

    [Fact]
    public async Task Start_WhenPortCannotBind_RejectsBeforeHostedWork()
    {
        var settings = ValidSettings();
        settings["SmtpSettings:SmtpPort"] = "not-a-number";
        var probe = new StartupProbe();
        using var host = CreateHost(settings, probe);
        var error = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            host.StartAsync(TestContext.Current.CancellationToken)
        );
        Assert.Contains("SmtpSettings:SmtpPort", error.Message, StringComparison.Ordinal);
        Assert.False(probe.Started);
    }

    [Fact]
    public async Task Bind_WhenEnvironmentKeysUseDoubleUnderscores_LoadsSmtpSettings()
    {
        var prefix = "RESEARCHCRUISE_SMTP_NATIVE_TEST_" + Guid.NewGuid().ToString("N") + "_";
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
            await host.StartAsync(TestContext.Current.CancellationToken);
            var bound = host.Services.GetRequiredService<IOptions<SmtpSettings>>().Value;
            Assert.Equal("smtp.gmail.com", bound.SmtpServer);
            Assert.Equal(465, bound.SmtpPort);
            Assert.Equal("sender@example.com", bound.SmtpUsername);
            Assert.Equal("private-test-password", bound.SmtpPassword);
            await host.StopAsync(TestContext.Current.CancellationToken);
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
}
