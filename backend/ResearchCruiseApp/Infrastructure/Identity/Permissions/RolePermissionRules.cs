using ResearchCruiseApp.Domain.Constants;

namespace ResearchCruiseApp.Infrastructure.Identity.Permissions;

public static class RolePermissionRules
{
    public static bool CanAssignRole(IList<string> currentUserRoles, string roleName)
    {
        if (currentUserRoles.Contains(RoleName.Administrator))
            return true;

        return currentUserRoles.Contains(RoleName.Shipowner)
            && roleName is not RoleName.Administrator and not RoleName.Shipowner;
    }

    public static bool CanAccessUser(IList<string> currentUserRoles, IList<string> otherUserRoles)
    {
        if (currentUserRoles.Contains(RoleName.Administrator))
            return true;

        return currentUserRoles.Contains(RoleName.Shipowner)
            && (
                otherUserRoles.Contains(RoleName.CruiseManager)
                || otherUserRoles.Contains(RoleName.Guest)
                || otherUserRoles.Contains(RoleName.ShipCrew)
            );
    }

    public static bool CanDeleteUser(IList<string> currentUserRoles, IList<string> otherUserRoles)
    {
        if (currentUserRoles.Contains(RoleName.Administrator))
            return true;

        return currentUserRoles.Contains(RoleName.Shipowner)
            && !otherUserRoles.Contains(RoleName.Administrator)
            && !otherUserRoles.Contains(RoleName.Shipowner);
    }
}
