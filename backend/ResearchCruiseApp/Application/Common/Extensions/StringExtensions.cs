namespace ResearchCruiseApp.Application.Common.Extensions;

public static class StringExtensions
{
    public static bool ToBool(this string value)
    {
        return !string.IsNullOrEmpty(value)
            && !value.Equals("false", StringComparison.CurrentCultureIgnoreCase);
    }

    public static T ToEnum<T>(this string value)
        where T : Enum
    {
        return (T)Enum.Parse(typeof(T), value);
    }
}
