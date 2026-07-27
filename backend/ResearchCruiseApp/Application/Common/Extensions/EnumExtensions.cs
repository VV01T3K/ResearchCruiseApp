using System.Reflection;
using ResearchCruiseApp.Domain.Common.Attributes;

namespace ResearchCruiseApp.Application.Common.Extensions;

public static class EnumExtensions
{
    public static string GetStringValue(this Enum value)
    {
        var fieldInfo = value.GetType().GetField(value.ToString());
        if (fieldInfo is null)
            return string.Empty;

        var attribute = fieldInfo.GetCustomAttribute(typeof(StringValueAttribute), false);
        if (attribute is not StringValueAttribute stringValueAttribute)
            return string.Empty;

        return stringValueAttribute.Value;
    }

    public static TEnum? GetEnumFromStringValue<TEnum>(string value)
        where TEnum : struct, Enum
    {
        foreach (var enumValue in Enum.GetValues<TEnum>())
        {
            if (((Enum)(object)enumValue).GetStringValue() == value)
                return enumValue;
        }

        return null;
    }
}
