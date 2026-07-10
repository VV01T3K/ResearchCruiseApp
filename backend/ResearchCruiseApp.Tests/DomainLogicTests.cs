using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using Xunit;

namespace ResearchCruiseApp.Tests;

// NOTE: The backend test suite was trimmed down to a single smoke test during the
// backend v2 rewrite. We should build out proper coverage again once the new
// architecture settles — domain rules, access control, persistence, projections
// and routing all deserve their own dedicated tests.
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
