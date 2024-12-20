using System.Globalization;

namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface IGlobalizationService
{
    CultureInfo GetCultureInfo();

    TimeZoneInfo GetTimeZoneInfo();

    string GetIsoUtcString(DateTime date);
    
    string GetLocalString(string isoUtcString);
}