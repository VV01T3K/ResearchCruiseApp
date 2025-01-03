using System.Globalization;
using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.ExternalServices;

namespace ResearchCruiseApp.Infrastructure.Services;

public class GlobalizationService : IGlobalizationService
{
    private const string CultureInfoId = "pl-pl";
    private const string TimeZoneInfoId = "Central European Standard Time";

    public CultureInfo GetCultureInfo() => new(CultureInfoId);

    public TimeZoneInfo GetTimeZoneInfo() => TimeZoneInfo.FindSystemTimeZoneById(TimeZoneInfoId);

    public string GetIsoUtcString(DateTime date)
    {
        if (date.Kind != DateTimeKind.Unspecified)
            date = DateTime.SpecifyKind(date, DateTimeKind.Unspecified);

        var timeZoneInfo = GetTimeZoneInfo();
        var dateUtc = TimeZoneInfo.ConvertTimeToUtc(date, timeZoneInfo);
        var dateString = dateUtc.ToString(DateConstants.IsoStringDateFormat);

        return dateString;
    }

    public string GetLocalString(string isoUtcString)
    {
        var utcDate = DateTime.Parse(isoUtcString, null, DateTimeStyles.RoundtripKind);
        var timeZoneInfo = GetTimeZoneInfo();
        var localDate = TimeZoneInfo.ConvertTimeFromUtc(utcDate, timeZoneInfo);
        var localDateString = localDate.ToString(DateConstants.LocalStringDateFormat);

        return localDateString;
    }
}
