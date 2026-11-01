using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;

namespace ResearchCruiseApp.IntegrationTests.Infrastructure;

public sealed class JwtStartupTests
{
    [Theory]
    [InlineData("ValidIssuer", "")]
    [InlineData("ValidAudience", " ")]
    [InlineData("AccessTokenLifetimeSeconds", "0")]
    [InlineData("RefreshTokenLifetimeSeconds", "-1")]
    [InlineData("Secret", "shorter-than-32-bytes")]
    public async Task Start_WhenJwtSettingIsInvalid_FailsBeforeOpeningDatabase(
        string key,
        string value
    )
    {
        await using var app = new TestApplication(
            "Server=127.0.0.1,1;Database=NeverOpened;User ID=synthetic;Password=synthetic;TrustServerCertificate=true;Connect Timeout=1"
        );
        await using var invalid = app.WithWebHostBuilder(builder =>
            builder.ConfigureServices((context, _) => context.Configuration[$"JWT:{key}"] = value)
        );

        var error = Assert.Throws<OptionsValidationException>(() => invalid.CreateClient());

        Assert.Contains($"JWT:{key}", error.Message, StringComparison.Ordinal);
    }
}
