using System.Text.Json;
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
    [InlineData(CruiseApplicationStatus.Draft, "draft")]
    [InlineData(CruiseApplicationStatus.WaitingForSupervisor, "waitingForSupervisor")]
    [InlineData(CruiseApplicationStatus.AcceptedBySupervisor, "acceptedBySupervisor")]
    [InlineData(CruiseApplicationStatus.DeniedBySupervisor, "deniedBySupervisor")]
    [InlineData(CruiseApplicationStatus.Accepted, "accepted")]
    [InlineData(CruiseApplicationStatus.Denied, "denied")]
    [InlineData(CruiseApplicationStatus.FormBRequired, "formBRequired")]
    [InlineData(CruiseApplicationStatus.FormBFilled, "formBFilled")]
    [InlineData(CruiseApplicationStatus.Undertaken, "undertaken")]
    [InlineData(CruiseApplicationStatus.Reported, "reported")]
    public void WorkflowStatusesExposeStableCodes(Enum status, string expectedCode)
    {
        Assert.Equal(expectedCode, JsonNamingPolicy.CamelCase.ConvertName(status.ToString()));
    }
}
