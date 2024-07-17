using System.Security.Claims;
using ResearchCruiseApp_API.Data;

namespace ResearchCruiseApp_API.Tools;

public interface IUserPermissionVerifier
{
    public Task<bool> CanUserAssignRoleAsync(IEnumerable<Claim> userClaims, string roleName);

    public Task<bool> CanUserAccessAsync(IEnumerable<Claim> userClaims, User otherUser);
}