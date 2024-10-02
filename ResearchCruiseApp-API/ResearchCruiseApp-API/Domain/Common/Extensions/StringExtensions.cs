namespace ResearchCruiseApp_API.Domain.Common.Extensions;


public static class StringExtensions
{
    public static bool ToBool(this string value)
    {
        return string.IsNullOrEmpty(value) &&
               !value.Equals("false", StringComparison.CurrentCultureIgnoreCase);
    }
}