namespace ResearchCruiseApp_API.Infrastructure.Tools.Attributes;


[AttributeUsage(AttributeTargets.Field)]
public class StringValueAttribute : Attribute
{
    public string Value { get; private set; }


    public StringValueAttribute(string value)
    {
        Value = value;
    }
}