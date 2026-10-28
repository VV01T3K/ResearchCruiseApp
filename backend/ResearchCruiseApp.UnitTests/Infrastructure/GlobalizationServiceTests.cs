using System.Globalization;
using ResearchCruiseApp.Infrastructure.Localization;

namespace ResearchCruiseApp.UnitTests.Infrastructure;

public sealed class GlobalizationServiceTests
{
    [Theory]
    [InlineData("en-US")]
    [InlineData("de-DE")]
    [InlineData("fi-FI")]
    [InlineData("ar-SA")]
    public void DateStrings_DoNotDependOnCurrentCulture(string culture)
    {
        var previous = CultureInfo.CurrentCulture;
        CultureInfo.CurrentCulture = new CultureInfo(culture);
        try
        {
            var service = new GlobalizationService();

            Assert.Equal(
                "2026-07-01T10:30:00.000Z",
                service.GetIsoUtcString(new DateTime(2026, 7, 1, 12, 30, 0))
            );
            Assert.Equal("01.07.2026 (12:30)", service.GetLocalString("2026-07-01T10:30:00.000Z"));
        }
        finally
        {
            CultureInfo.CurrentCulture = previous;
        }
    }
}
