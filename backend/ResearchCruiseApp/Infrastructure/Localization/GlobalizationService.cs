using System.Globalization;

namespace ResearchCruiseApp.Infrastructure.Localization;

public class GlobalizationService(TimeProvider clock)
{
    private const string CultureInfoId = "pl-pl";
    private const string TimeZoneInfoId = "Central European Standard Time";

    public CultureInfo GetCultureInfo() => new(CultureInfoId);

    public TimeZoneInfo GetTimeZoneInfo() => TimeZoneInfo.FindSystemTimeZoneById(TimeZoneInfoId);

    public DateOnly GetCurrentDate() =>
        DateOnly.FromDateTime(
            TimeZoneInfo.ConvertTime(clock.GetUtcNow(), GetTimeZoneInfo()).DateTime
        );

    public DateTime GetPolishDayStartUtc(DateTime utc, int addDays = 0)
    {
        var timeZone = GetTimeZoneInfo();
        var day = TimeZoneInfo
            .ConvertTimeFromUtc(DateTime.SpecifyKind(utc, DateTimeKind.Utc), timeZone)
            .Date.AddDays(addDays);
        return TimeZoneInfo.ConvertTimeToUtc(
            DateTime.SpecifyKind(day, DateTimeKind.Unspecified),
            timeZone
        );
    }

    public string GetIsoUtcString(DateTime date)
    {
        if (date.Kind != DateTimeKind.Unspecified)
            date = DateTime.SpecifyKind(date, DateTimeKind.Unspecified);

        var timeZoneInfo = GetTimeZoneInfo();
        var dateUtc = TimeZoneInfo.ConvertTimeToUtc(date, timeZoneInfo);
        var dateString = dateUtc.ToString(
            DateFormats.IsoStringDateFormat,
            CultureInfo.InvariantCulture
        );

        return dateString;
    }

    public string GetLocalString(string isoUtcString)
    {
        var utcDate = DateTime.Parse(isoUtcString, null, DateTimeStyles.RoundtripKind);
        var timeZoneInfo = GetTimeZoneInfo();
        var localDate = TimeZoneInfo.ConvertTimeFromUtc(utcDate, timeZoneInfo);
        var localDateString = localDate.ToString(
            DateFormats.LocalStringDateFormat,
            GetCultureInfo()
        );

        return localDateString;
    }
}
