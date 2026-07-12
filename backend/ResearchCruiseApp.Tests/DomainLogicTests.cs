using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class DomainLogicTests
{
    [Theory]
    [InlineData(CruiseStatus.New, "new")]
    [InlineData(CruiseStatus.Confirmed, "confirmed")]
    [InlineData(CruiseStatus.Ended, "ended")]
    public void CruiseStatusesExposeStableCodes(CruiseStatus status, string expectedCode)
    {
        Assert.Equal(expectedCode, status.ToCode());
    }
}
