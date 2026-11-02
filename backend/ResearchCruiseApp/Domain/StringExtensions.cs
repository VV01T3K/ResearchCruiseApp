namespace ResearchCruiseApp.Domain;

public static class StringExtensions
{
    public static bool ToBool(this string value)
    {
        return string.Equals(value, "true", StringComparison.OrdinalIgnoreCase);
    }

    public static T ToEnum<T>(this string value)
        where T : Enum
    {
        return (T)Enum.Parse(typeof(T), value);
    }
}
