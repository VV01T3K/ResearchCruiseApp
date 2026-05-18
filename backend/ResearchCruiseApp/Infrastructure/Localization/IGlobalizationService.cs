using System.Globalization;

namespace ResearchCruiseApp.Infrastructure.Localization;

public interface IGlobalizationService
{
    CultureInfo GetCultureInfo();

    TimeZoneInfo GetTimeZoneInfo();

    string GetIsoUtcString(DateTime date);

    string GetLocalString(string isoUtcString);
}
