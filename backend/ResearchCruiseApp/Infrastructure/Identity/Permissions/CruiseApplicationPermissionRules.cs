using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Identity.Permissions;

public static class CruiseApplicationPermissionRules
{
    public static bool CanView(
        IList<string> roles,
        Guid currentUserId,
        CruiseApplication application
    )
    {
        var assignedToUser =
            application.FormA?.CruiseManagerId == currentUserId
            || application.FormA?.DeputyManagerId == currentUserId;

        return assignedToUser
            || (
                CanViewSubmittedApplications(roles)
                && application.Status != CruiseApplicationStatus.Draft
            );
    }

    public static IQueryable<CruiseApplication> FilterVisible(
        IQueryable<CruiseApplication> query,
        IList<string> roles,
        Guid? currentUserId
    )
    {
        if (currentUserId is null)
            return query.Where(_ => false);

        var userId = currentUserId.Value;
        if (CanViewSubmittedApplications(roles))
        {
            return query.Where(application =>
                application.Status != CruiseApplicationStatus.Draft
                || (
                    application.FormA != null
                    && (
                        application.FormA.CruiseManagerId == userId
                        || application.FormA.DeputyManagerId == userId
                    )
                )
            );
        }

        return query.Where(application =>
            application.FormA != null
            && (
                application.FormA.CruiseManagerId == userId
                || application.FormA.DeputyManagerId == userId
            )
        );
    }

    private static bool CanViewSubmittedApplications(IList<string> roles)
    {
        return roles.Contains(RoleName.Administrator)
            || roles.Contains(RoleName.Shipowner)
            || roles.Contains(RoleName.Guest)
            || roles.Contains(RoleName.ShipCrew);
    }
}
