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
            var service = new GlobalizationService(TimeProvider.System);

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

    [Theory]
    [InlineData("2026-12-31T22:59:59Z", "2026-12-31")]
    [InlineData("2026-12-31T23:00:00Z", "2027-01-01")]
    [InlineData("2026-12-31T23:30:00Z", "2027-01-01")]
    [InlineData("2026-07-01T21:59:59Z", "2026-07-01")]
    [InlineData("2026-07-01T22:00:00Z", "2026-07-02")]
    public void GetCurrentDate_FollowsThePolishCalendar(string utcNow, string expected)
    {
        var clock = new FixedClock(DateTimeOffset.Parse(utcNow, CultureInfo.InvariantCulture));

        Assert.Equal(
            DateOnly.Parse(expected, CultureInfo.InvariantCulture),
            new GlobalizationService(clock).GetCurrentDate()
        );
    }

    private sealed class FixedClock(DateTimeOffset now) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => now;
    }
}
