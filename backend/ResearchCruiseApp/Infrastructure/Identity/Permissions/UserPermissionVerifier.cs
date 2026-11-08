using System.Linq.Expressions;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Infrastructure.Identity.Permissions;

internal class UserPermissionVerifier(
    UserManager<User> userManager,
    ApplicationDbContext dbContext,
    CurrentUserService currentUserService
)
{
    private Expression<Func<CruiseApplication, bool>>? _applicationVisibility;
    private Func<CruiseApplication, bool>? _canViewApplication;
    private IList<string>? _currentUserRoles;

    public async Task<bool> CanCurrentUserAssignRole(string roleName)
    {
        var currentUserRoles = await GetCurrentUserRoleNames();
        return RolePermissionPolicy.CanAssignRole(currentUserRoles, roleName);
    }

    public async Task<bool> CanCurrentUserAccess(Guid otherUserId)
    {
        var currentUserRoles = await GetCurrentUserRoleNames();

        var otherUserRoles = await userManager.GetUserRolesNames(otherUserId);
        return RolePermissionPolicy.CanAccessUser(currentUserRoles, otherUserRoles);
    }

    public async Task<List<UserDto>> FilterAccessibleUsers(IEnumerable<UserDto> users)
    {
        var currentUserRoles = await GetCurrentUserRoleNames();
        return users
            .Where(user => RolePermissionPolicy.CanAccessUser(currentUserRoles, user.Roles))
            .ToList();
    }

    public async Task<bool> CanCurrentUserViewCruiseApplication(CruiseApplication cruiseApplication)
    {
        _canViewApplication ??= (await GetApplicationVisibilityFilter()).Compile();
        return _canViewApplication(cruiseApplication);
    }

    public async Task<Expression<Func<CruiseApplication, bool>>> GetApplicationVisibilityFilter()
    {
        if (_applicationVisibility is not null)
            return _applicationVisibility;

        var currentUserRoles = await GetCurrentUserRoleNames();
        var currentUserId = currentUserService.GetId();

        if (currentUserId is null || currentUserRoles.All(role => role == RoleName.Guest))
            return _applicationVisibility = application => false;

        var canViewOthers =
            currentUserRoles.Contains(RoleName.Administrator)
            || currentUserRoles.Contains(RoleName.Shipowner)
            || currentUserRoles.Contains(RoleName.ShipCrew);

        // One rule serves both database queries and checks on already-loaded applications.
        return _applicationVisibility = application =>
            (canViewOthers && application.Status != CruiseApplicationStatus.Draft)
            || (
                application.FormA != null
                && (
                    application.FormA.CruiseManagerId == currentUserId
                    || application.FormA.DeputyManagerId == currentUserId
                )
            );
    }

    public async Task<bool> CanCurrentUserViewCruise(Cruise cruise)
    {
        var currentUserRoles = _currentUserRoles ??= await GetCurrentUserRoleNames();
        var currentUserId = currentUserService.GetId();

        if (currentUserId is null)
            return false;

        if (
            currentUserRoles.Contains(RoleName.Administrator)
            || currentUserRoles.Contains(RoleName.Shipowner)
            || currentUserRoles.Contains(RoleName.Guest)
            || currentUserRoles.Contains(RoleName.ShipCrew)
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
        var currentUserRoles = await GetCurrentUserRoleNames();

        if (cruiseApplication.FormA is null)
            return false;

        var currentUserId = currentUserService.GetId();
        if (
            currentUserId is null
            || !await dbContext.IsActiveWithAnyRole(
                currentUserId.Value,
                IdentityUserExtensions.CruiseManagerRoleNames
            )
        )
            return false;

        if (cruiseApplication.Status == CruiseApplicationStatus.Draft)
            return currentUserId == cruiseApplication.FormA.CruiseManagerId
                || currentUserId == cruiseApplication.FormA.DeputyManagerId;

        return RolePermissionPolicy.CanAddApplicationForm(
            currentUserRoles,
            currentUserId.Value,
            cruiseApplication.FormA.CruiseManagerId,
            cruiseApplication.FormA.DeputyManagerId
        );
    }

    public async Task<bool> CanCurrentUserViewForm(CruiseApplication cruiseApplication)
    {
        var currentUserId = currentUserService.GetId();
        var currentUserRoles = await GetCurrentUserRoleNames();
        var cruiseManagerId = cruiseApplication.FormA?.CruiseManagerId;
        var deputyManagerId = cruiseApplication.FormA?.DeputyManagerId;

        if (currentUserId is null || currentUserRoles.All(role => role == RoleName.Guest))
            return false;

        if (
            currentUserRoles.Contains(RoleName.Administrator)
            || currentUserRoles.Contains(RoleName.Shipowner)
            || currentUserRoles.Contains(RoleName.ShipCrew)
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

    public async Task<bool> CanUserDeactivate(Guid otherUserId)
    {
        var currentUserRoles = await GetCurrentUserRoleNames();
        var currentUserId = currentUserService.GetId();

        if (currentUserRoles.Contains(RoleName.Administrator))
            return currentUserId != otherUserId;

        if (currentUserRoles.Contains(RoleName.Shipowner))
        {
            var otherUserRoles = await userManager.GetUserRolesNames(otherUserId);

            return !otherUserRoles.Contains(RoleName.Administrator)
                && !otherUserRoles.Contains(RoleName.Shipowner);
        }

        return false;
    }

    public async Task<bool> CanUserDeleteOtherUsers(Guid otherUserId)
    {
        var currentUserRoles = await GetCurrentUserRoleNames();

        var otherUserRoles = await userManager.GetUserRolesNames(otherUserId);
        return RolePermissionPolicy.CanDeleteUser(currentUserRoles, otherUserRoles);
    }

    private async Task<IList<string>> GetCurrentUserRoleNames()
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
            return [];

        var currentUser = await userManager.FindByIdAsync(currentUserId.ToString()!);
        if (currentUser is null)
            return [];

        return await userManager.GetRolesAsync(currentUser);
    }
}
