using ResearchCruiseApp.Api.Cruises;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.UnitTests.Cruises;

public sealed class CruiseLifecycleRulesTests
{
    public static TheoryData<CruiseApplicationStatus> Statuses =>
        new(Enum.GetValues<CruiseApplicationStatus>());

    [Theory]
    [MemberData(nameof(Statuses))]
    public void RequestFormB_ForEachStatus_MovesOnlyAcceptedApplications(
        CruiseApplicationStatus status
    )
    {
        var application = new CruiseApplication { Status = status };

        var requested = CruiseLifecycleRules.RequestFormB([application]);

        var expected = status switch
        {
            CruiseApplicationStatus.Accepted => CruiseApplicationStatus.FormBRequired,
            _ => status,
        };
        Assert.Equal(expected, application.Status);
        Assert.Equal(status == CruiseApplicationStatus.Accepted, requested.Contains(application));
    }

    [Theory]
    [MemberData(nameof(Statuses))]
    public void Complete_FromConfirmed_MovesOnlyFilledFormBToUndertaken(
        CruiseApplicationStatus status
    )
    {
        var (cruise, application) = CruiseWith(CruiseStatus.Confirmed, status);

        var result = CruiseLifecycleRules.Complete(cruise);

        var expected = status switch
        {
            CruiseApplicationStatus.FormBFilled => CruiseApplicationStatus.Undertaken,
            _ => status,
        };
        Assert.Equal(
            (CruiseLifecycleResult.Applied, CruiseStatus.Ended, expected),
            (result, cruise.Status, application.Status)
        );
    }

    [Theory]
    [InlineData(CruiseStatus.New, CruiseLifecycleResult.NotConfirmed)]
    [InlineData(CruiseStatus.Ended, CruiseLifecycleResult.NotCompletable)]
    public void Complete_WhenNotConfirmed_ChangesNothing(
        CruiseStatus cruiseStatus,
        CruiseLifecycleResult expected
    )
    {
        foreach (var status in Enum.GetValues<CruiseApplicationStatus>())
        {
            var (cruise, application) = CruiseWith(cruiseStatus, status);

            var result = CruiseLifecycleRules.Complete(cruise);

            Assert.Equal(
                (expected, cruiseStatus, status),
                (result, cruise.Status, application.Status)
            );
        }
    }

    [Theory]
    [MemberData(nameof(Statuses))]
    public void Revert_FromConfirmed_ReturnsRequestedFormBToAcceptedUnlessReported(
        CruiseApplicationStatus status
    )
    {
        var (cruise, application) = CruiseWith(CruiseStatus.Confirmed, status);

        var result = CruiseLifecycleRules.Revert(cruise);

        Assert.Equal(
            status switch
            {
                CruiseApplicationStatus.Reported => (
                    CruiseLifecycleResult.HasReportedApplications,
                    CruiseStatus.Confirmed,
                    CruiseApplicationStatus.Reported
                ),
                CruiseApplicationStatus.FormBRequired => (
                    CruiseLifecycleResult.Applied,
                    CruiseStatus.New,
                    CruiseApplicationStatus.Accepted
                ),
                _ => (CruiseLifecycleResult.Applied, CruiseStatus.New, status),
            },
            (result, cruise.Status, application.Status)
        );
    }

    [Theory]
    [MemberData(nameof(Statuses))]
    public void Revert_FromEnded_ReturnsUndertakenToFormBFilledUnlessReported(
        CruiseApplicationStatus status
    )
    {
        var (cruise, application) = CruiseWith(CruiseStatus.Ended, status);

        var result = CruiseLifecycleRules.Revert(cruise);

        Assert.Equal(
            status switch
            {
                CruiseApplicationStatus.Reported => (
                    CruiseLifecycleResult.HasReportedApplications,
                    CruiseStatus.Ended,
                    CruiseApplicationStatus.Reported
                ),
                CruiseApplicationStatus.Undertaken => (
                    CruiseLifecycleResult.Applied,
                    CruiseStatus.Confirmed,
                    CruiseApplicationStatus.FormBFilled
                ),
                _ => (CruiseLifecycleResult.Applied, CruiseStatus.Confirmed, status),
            },
            (result, cruise.Status, application.Status)
        );
    }

    [Fact]
    public void Revert_FromNew_ChangesNothing()
    {
        foreach (var status in Enum.GetValues<CruiseApplicationStatus>())
        {
            var (cruise, application) = CruiseWith(CruiseStatus.New, status);

            var result = CruiseLifecycleRules.Revert(cruise);

            Assert.Equal(
                (CruiseLifecycleResult.AlreadyNew, CruiseStatus.New, status),
                (result, cruise.Status, application.Status)
            );
        }
    }

    [Theory]
    [InlineData(CruiseStatus.Confirmed)]
    [InlineData(CruiseStatus.Ended)]
    public void Revert_WithOneReportedApplication_LeavesEveryApplicationUnchanged(
        CruiseStatus cruiseStatus
    )
    {
        CruiseApplicationStatus[] statuses =
        [
            CruiseApplicationStatus.FormBRequired,
            CruiseApplicationStatus.FormBFilled,
            CruiseApplicationStatus.Undertaken,
            CruiseApplicationStatus.Reported,
        ];
        var cruise = new Cruise
        {
            Status = cruiseStatus,
            CruiseApplications =
            [
                .. statuses.Select(status => new CruiseApplication { Status = status }),
            ],
        };

        var result = CruiseLifecycleRules.Revert(cruise);

        Assert.Equal(CruiseLifecycleResult.HasReportedApplications, result);
        Assert.Equal(cruiseStatus, cruise.Status);
        Assert.Equal(statuses, cruise.CruiseApplications.Select(application => application.Status));
    }

    private static (Cruise Cruise, CruiseApplication Application) CruiseWith(
        CruiseStatus cruiseStatus,
        CruiseApplicationStatus applicationStatus
    )
    {
        var application = new CruiseApplication { Status = applicationStatus };
        return (
            new Cruise { Status = cruiseStatus, CruiseApplications = [application] },
            application
        );
    }
}
