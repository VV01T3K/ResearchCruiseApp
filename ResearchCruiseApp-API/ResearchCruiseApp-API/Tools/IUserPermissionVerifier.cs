using System.Security.Claims;
using ResearchCruiseApp_API.Data;

namespace ResearchCruiseApp_API.Tools;

public interface IUserPermissionVerifier
{
    public Task<bool> CanUserAssignRoleAsync(ClaimsPrincipal user, string roleName);

    public Task<bool> CanUserAccessAsync(ClaimsPrincipal user, User otherUser);
}