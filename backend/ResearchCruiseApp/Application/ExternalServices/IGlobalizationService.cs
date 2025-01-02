using System.Globalization;

namespace ResearchCruiseApp.Application.ExternalServices;


public interface IGlobalizationService
{
    CultureInfo GetCultureInfo();

    TimeZoneInfo GetTimeZoneInfo();

    string GetIsoUtcString(DateTime date);
    
    string GetLocalString(string isoUtcString);
}