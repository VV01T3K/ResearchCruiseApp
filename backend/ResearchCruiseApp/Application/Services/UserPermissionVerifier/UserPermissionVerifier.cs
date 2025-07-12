using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.UserPermissionVerifier;

public class UserPermissionVerifier(
    IIdentityService identityService,
    ICurrentUserService currentUserService
) : IUserPermissionVerifier
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

    public async Task<bool> CanCurrentUserAccess(Guid otherUserId)
    {
        var currentUserRoles = await identityService.GetCurrentUserRoleNames();

        if (currentUserRoles.Contains(RoleName.Administrator))
            return true;

        if (currentUserRoles.Contains(RoleName.Shipowner))
        {
            var otherUserRoles = await identityService.GetUserRolesNames(otherUserId);
            if (
                otherUserRoles.Contains(RoleName.CruiseManager)
                || otherUserRoles.Contains(RoleName.Guest)
            )
            {
                return true;
            }
        }
        return false;
    }

    public async Task<bool> CanCurrentUserViewCruiseApplication(CruiseApplication cruiseApplication)
    {
        var currentUserRoles = await identityService.GetCurrentUserRoleNames();
        var currentUserId = currentUserService.GetId();
        var cruiseManagerId = cruiseApplication.FormA?.CruiseManagerId;
        var deputyManagerId = cruiseApplication.FormA?.DeputyManagerId;

        if (currentUserId is null)
            return false;

        if (
            currentUserRoles.Contains(RoleName.Administrator)
            || currentUserRoles.Contains(RoleName.Shipowner)
            || currentUserRoles.Contains(RoleName.Guest)
        )
        {
            if (cruiseApplication.Status == CruiseApplicationStatus.Draft)
            {
                return currentUserId == cruiseManagerId || currentUserId == deputyManagerId;
            }

            return true;
        }

        // currentUserId is not null so comparing with null will give false
        if (
            cruiseApplication.FormA?.CruiseManagerId == currentUserId
            || cruiseApplication.FormA?.DeputyManagerId == currentUserId
        )
        {
            return true;
        }

        return false;
    }

    public async Task<bool> CanCurrentUserViewCruise(Cruise cruise)
    {
        var currentUserRoles = await identityService.GetCurrentUserRoleNames();
        var currentUserId = currentUserService.GetId();

        if (currentUserId is null)
            return false;

        if (
            currentUserRoles.Contains(RoleName.Administrator)
            || currentUserRoles.Contains(RoleName.Shipowner)
            || currentUserRoles.Contains(RoleName.Guest)
        )
        {
            return true;
        }

        // currentUserId is not null so comparing with null will give false
        if (
            cruise.CruiseApplications.Any(cruiseApplication =>
                cruiseApplication.FormA?.DeputyManagerId == currentUserId
                || cruiseApplication.FormA?.CruiseManagerId == currentUserId
            )
        )
        {
            return true;
        }

        return false;
    }

    public async Task<bool> CanCurrentUserAddForm(CruiseApplication cruiseApplication)
    {
        var currentUserRoles = await identityService.GetCurrentUserRoleNames();

        if (currentUserRoles.Contains(RoleName.Administrator))
            return true;

        if (cruiseApplication.FormA is null)
            return false;

        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
            return false;

        return cruiseApplication.FormA.CruiseManagerId == currentUserId
            || cruiseApplication.FormA.DeputyManagerId == currentUserId;
    }

    public async Task<bool> CanCurrentUserViewForm(CruiseApplication cruiseApplication)
    {
        var currentUserId = currentUserService.GetId();
        var currentUserRoles = await identityService.GetCurrentUserRoleNames();
        var cruiseManagerId = cruiseApplication.FormA?.CruiseManagerId;
        var deputyManagerId = cruiseApplication.FormA?.DeputyManagerId;

        if (currentUserId is null)
            return false;

        if (
            currentUserRoles.Contains(RoleName.Administrator)
            || currentUserRoles.Contains(RoleName.Shipowner)
            || currentUserRoles.Contains(RoleName.Guest)
        )
        {
            if (cruiseApplication.Status == CruiseApplicationStatus.Draft)
            {
                return currentUserId == cruiseManagerId || currentUserId == deputyManagerId;
            }

            return true;
        }

        return cruiseApplication.FormA?.CruiseManagerId == currentUserId
            || cruiseApplication.FormA?.DeputyManagerId == currentUserId;
    }

    public Task<bool> CanCurrentUserUpdateEffects(CruiseApplication cruiseApplication) =>
        CanCurrentUserAddForm(cruiseApplication);

    public async Task<bool> CanUserDeactivate(Guid otherUserId)
    {
        var currentUserRoles = await identityService.GetCurrentUserRoleNames();
        var currentUserId = currentUserService.GetId();

        if (currentUserRoles.Contains(RoleName.Administrator))
            return currentUserId != otherUserId;

        if (currentUserRoles.Contains(RoleName.Shipowner))
        {
            var otherUserRoles = await identityService.GetUserRolesNames(otherUserId);

            return !otherUserRoles.Contains(RoleName.Administrator)
                && !otherUserRoles.Contains(RoleName.Shipowner);
        }

        return false;
    }

    public async Task<bool> CanUserDeleteOtherUsers(Guid otherUserId)
    {
        var currentUserRoles = await identityService.GetCurrentUserRoleNames();
        
        if (currentUserRoles.Contains(RoleName.Administrator))
            return true;
            
        if (currentUserRoles.Contains(RoleName.Shipowner))
        {
            var otherUserRoles = await identityService.GetUserRolesNames(otherUserId);
            // Shipowner can delete users except Administrator and other Shipowners
            if (otherUserRoles.Contains(RoleName.Administrator) || otherUserRoles.Contains(RoleName.Shipowner))
                return false;
            return true;
        }
        
        return false;
    }
}
