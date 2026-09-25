using ResearchCruiseApp.Infrastructure.Email;

namespace ResearchCruiseApp.UnitTests.Infrastructure;

public sealed class SmtpSettingsTests
{
    // BE-SMTP-001: SMTP setup defines the inclusive TCP port range.
    [Theory]
    [InlineData(0, false)]
    [InlineData(1, true)]
    [InlineData(65535, true)]
    [InlineData(65536, false)]
    public void Validate_WhenPortIsAtBoundary_AcceptsOnlyValidPorts(int port, bool expectedSuccess)
    {
        var settings = new SmtpSettings
        {
            SmtpServer = "smtp.example.invalid",
            SmtpPort = port,
            SmtpUsername = "sender@example.invalid",
            SmtpPassword = "synthetic-secret",
        };

        var result = new SmtpSettingsValidator().Validate(null, settings);

        Assert.Equal(expectedSuccess, result.Succeeded);
        if (!expectedSuccess)
            Assert.Contains(
                result.Failures!,
                failure => failure.Contains("SmtpSettings:SmtpPort", StringComparison.Ordinal)
            );
    }
}
