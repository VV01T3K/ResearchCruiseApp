namespace ResearchCruiseApp_API.Tools.Attributes;

[AttributeUsage(AttributeTargets.Field, AllowMultiple = false)]
public class StringValueAttribute : Attribute
{
    public string Value { get; private set; }


    public StringValueAttribute(string value)
    {
        Value = value;
    }
}