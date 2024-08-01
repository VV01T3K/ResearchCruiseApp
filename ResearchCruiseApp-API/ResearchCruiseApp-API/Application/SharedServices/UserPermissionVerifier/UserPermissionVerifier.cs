using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp_API.Domain.Common.Constants;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.SharedServices.UserPermissionVerifier;


public class UserPermissionVerifier(UserManager<User> userManager) : IUserPermissionVerifier
{
    public async Task<bool> CanUserAssignRoleAsync(ClaimsPrincipal user, string roleName)
    {
        var currentUserRoles = await GetCurrentUserRoles(user);

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

    public async Task<bool> CanUserAccessAsync(ClaimsPrincipal user, User otherUser)
    {
        var currentUserRoles = await GetCurrentUserRoles(user);

        if (currentUserRoles.Contains(RoleName.Administrator))
            return true;
        if (currentUserRoles.Contains(RoleName.Shipowner))
        {
            var otherUserRoles = await userManager.GetRolesAsync(otherUser);
            if (otherUserRoles.Contains(RoleName.CruiseManager) ||
                otherUserRoles.Contains(RoleName.Guest))
            {
                return true;
            }
        }
        return false;
    }


    private async Task<IList<string>> GetCurrentUserRoles(ClaimsPrincipal user)
    {
        var currentUserId = user.Claims
            .FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)
            ?.Value;
        if (currentUserId is null)
            return [];

        var currentUser = await userManager.FindByIdAsync(currentUserId);
        if (currentUser is null)
            return [];

        return await userManager.GetRolesAsync(currentUser);
    }
}