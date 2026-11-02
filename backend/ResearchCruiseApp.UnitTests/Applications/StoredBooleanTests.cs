using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.UnitTests.Applications;

public sealed class StoredBooleanTests
{
    [Theory]
    [InlineData("true", true)]
    [InlineData("True", true)]
    [InlineData("false", false)]
    [InlineData("FALSE", false)]
    [InlineData("0", false)]
    [InlineData("1", false)]
    [InlineData("", false)]
    [InlineData("tak", false)]
    public void ToBool_WhenValueIsNotCaseInsensitiveTrue_ReturnsFalse(string value, bool expected)
    {
        Assert.Equal(expected, value.ToBool());
    }
}
