using System.Reflection;
using ResearchCruiseApp_API.Infrastructure.Tools.Attributes;

namespace ResearchCruiseApp_API.Infrastructure.Tools.Extensions;


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
}