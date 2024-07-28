using System.Security.Claims;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Tools;


public interface IUserPermissionVerifier
{
    public Task<bool> CanUserAssignRoleAsync(ClaimsPrincipal user, string roleName);

    public Task<bool> CanUserAccessAsync(ClaimsPrincipal user, User otherUser);
}