using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Domain.Common.Constants;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.SharedServices.UserPermissionVerifier;


public class UserPermissionVerifier(IIdentityService identityService) : IUserPermissionVerifier
{
    public async Task<bool> CanCurrentUserAssignRole(string roleName)
    {
        var currentUserRoles = await identityService.GetCurrentUserRoleNames();

        if (currentUserRoles.Contains(RoleName.Administrator))
            return true;
        if (currentUserRoles.Contains(RoleName.Shipowner))
        {
            if (roleName is RoleName.Administrator or RoleName.Shipowner)
                return false;
            return true;
        }
        return false;
    }

    public async Task<bool> CanCurrentUserAccess(User otherUser)
    {
        var currentUserRoles = await identityService.GetCurrentUserRoleNames();

        if (currentUserRoles.Contains(RoleName.Administrator))
            return true;
        if (currentUserRoles.Contains(RoleName.Shipowner))
        {
            var otherUserRoles = await identityService.GetUserRolesNames(otherUser);
            if (otherUserRoles.Contains(RoleName.CruiseManager) ||
                otherUserRoles.Contains(RoleName.Guest))
            {
                return true;
            }
        }
        return false;
    }
}