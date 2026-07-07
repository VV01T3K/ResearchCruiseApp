using ResearchCruiseApp.Api;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Cruises;
using ResearchCruiseApp.Domain.Common.Constants;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class DomainLogicTests
{
    [Fact]
    public void ApplicationDecisionAcceptsEligibleApplication()
    {
        var application = new CruiseApplication
        {
            Status = CruiseApplicationStatus.AcceptedBySupervisor,
        };

        var result = ApplicationDecisionRules.Decide(application, accept: true);

        Assert.Equal(ApplicationDecisionResult.Applied, result);
        Assert.Equal(CruiseApplicationStatus.Accepted, application.Status);
    }

    [Fact]
    public void ApplicationDecisionRejectsAcceptedApplicationStillAssignedToCruise()
    {
        var application = new CruiseApplication
        {
            Status = CruiseApplicationStatus.Accepted,
            Cruise = new Cruise(),
        };

        var result = ApplicationDecisionRules.Decide(application, accept: false);

        Assert.Equal(ApplicationDecisionResult.RemoveFromCruiseFirst, result);
        Assert.Equal(CruiseApplicationStatus.Accepted, application.Status);
    }

    [Fact]
    public void SupervisorDecisionCannotOverrideOfficeRejection()
    {
        var application = new CruiseApplication { Status = CruiseApplicationStatus.Denied };

        var result = SupervisorDecisionRules.Decide(application, accept: true);

        Assert.Equal(SupervisorDecisionResult.RejectedByOffice, result);
        Assert.Equal(CruiseApplicationStatus.Denied, application.Status);
    }

    [Fact]
    public void CompletingConfirmedCruiseAdvancesReadyApplications()
    {
        var application = new CruiseApplication { Status = CruiseApplicationStatus.FormBFilled };
        var cruise = new Cruise
        {
            Status = CruiseStatus.Confirmed,
            CruiseApplications = [application],
        };

        var result = CruiseLifecycleRules.Complete(cruise);

        Assert.Equal(CruiseLifecycleResult.Applied, result);
        Assert.Equal(CruiseStatus.Ended, cruise.Status);
        Assert.Equal(CruiseApplicationStatus.Undertaken, application.Status);
    }

    [Fact]
    public void RevertingEndedCruiseReturnsApplicationsToFormBFilled()
    {
        var application = new CruiseApplication { Status = CruiseApplicationStatus.Undertaken };
        var cruise = new Cruise { Status = CruiseStatus.Ended, CruiseApplications = [application] };

        var result = CruiseLifecycleRules.Revert(cruise);

        Assert.Equal(CruiseLifecycleResult.Applied, result);
        Assert.Equal(CruiseStatus.Confirmed, cruise.Status);
        Assert.Equal(CruiseApplicationStatus.FormBFilled, application.Status);
    }

    [Fact]
    public void BlockadeRulesFindFreeGapBetweenMergedBlockades()
    {
        var noFreeWindow = CruiseBlockadeRules.HasNoFreeWindow(
            new DateTime(2026, 6, 1),
            new DateTime(2026, 6, 10),
            requiredDurationDays: 2,
            [
                (new DateTime(2026, 6, 1), new DateTime(2026, 6, 3)),
                (new DateTime(2026, 6, 3), new DateTime(2026, 6, 5)),
                (new DateTime(2026, 6, 8), new DateTime(2026, 6, 10)),
            ]
        );

        Assert.False(noFreeWindow);
    }

    [Theory]
    [InlineData(CruiseStatus.New, "new")]
    [InlineData(CruiseStatus.Confirmed, "confirmed")]
    [InlineData(CruiseStatus.Ended, "ended")]
    public void CruiseStatusesExposeStableCodes(CruiseStatus status, string expectedCode)
    {
        Assert.Equal(expectedCode, status.ToCode());
    }

    [Theory]
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
    public void ApplicationStatusesExposeStableCodes(
        CruiseApplicationStatus status,
        string expectedCode
    )
    {
        Assert.Equal(expectedCode, status.ToCode());
    }

    [Fact]
    public void ShipownersCannotAssignPrivilegedRoles()
    {
        Assert.False(
            RolePermissionRules.CanAssignRole([RoleName.Shipowner], RoleName.Administrator)
        );
        Assert.False(RolePermissionRules.CanAssignRole([RoleName.Shipowner], RoleName.Shipowner));
        Assert.True(RolePermissionRules.CanAssignRole([RoleName.Shipowner], RoleName.Guest));
    }

    [Fact]
    public void ShipownersCannotDeletePrivilegedUsers()
    {
        Assert.False(
            RolePermissionRules.CanDeleteUser([RoleName.Shipowner], [RoleName.Administrator])
        );
        Assert.False(RolePermissionRules.CanDeleteUser([RoleName.Shipowner], [RoleName.Shipowner]));
        Assert.True(RolePermissionRules.CanDeleteUser([RoleName.Shipowner], [RoleName.Guest]));
    }
}
