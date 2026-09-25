using ResearchCruiseApp.Api.Applications;

namespace ResearchCruiseApp.UnitTests.Applications;

public sealed class CruiseBlockadeTests
{
    // BE-BLOCKADE-001: a cruise needs one contiguous interval, not summed fragments.
    [Theory]
    [InlineData("none", 4, false)]
    [InlineData("none", 4.01, true)]
    [InlineData("middle", 2, false)]
    [InlineData("middle", 2.01, true)]
    [InlineData("overlapping", 1, false)]
    [InlineData("overlapping", 1.01, true)]
    [InlineData("outside", 4, false)]
    [InlineData("covers-all", 0.5, true)]
    [InlineData("fragmented", 1.5, true)]
    [InlineData("adjacent", 1.5, true)]
    [InlineData("half-day", 0.5, false)]
    [InlineData("half-day", 0.51, true)]
    public void FindWindow_WhenBlockadesMeetDurationBoundaries_RequiresContiguousAvailableTime(
        string arrangement,
        double duration,
        bool unavailable
    )
    {
        var start = new DateTime(2030, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var end = new DateTime(2030, 1, 5, 0, 0, 0, DateTimeKind.Utc);
        (DateTime Start, DateTime End)[] blockades = arrangement switch
        {
            "none" => [],
            "middle" => [(start.AddDays(1), start.AddDays(2))],
            // Deliberately reversed input order with an overlap.
            "overlapping" => [(start.AddDays(1), start.AddDays(3)), (start, start.AddDays(2))],
            "outside" => [(start.AddDays(-1), start), (end, end.AddDays(1))],
            "covers-all" => [(start.AddDays(-1), end.AddDays(1))],
            "fragmented" => [(start.AddDays(1), start.AddDays(2)), (start.AddDays(3), end)],
            "adjacent" =>
            [
                (start.AddDays(1), start.AddDays(2)),
                (start.AddDays(2), start.AddDays(3)),
            ],
            "half-day" => [(start.AddHours(12), end.AddHours(-12))],
            _ => throw new ArgumentOutOfRangeException(nameof(arrangement)),
        };

        var actual = CruiseBlockadeRules.HasNoFreeWindow(start, end, duration, blockades);

        Assert.Equal(unavailable, actual);
    }
}
