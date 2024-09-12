namespace ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;


public interface IUserPermissionVerifier
{
    public Task<bool> CanCurrentUserAssignRole(string roleName);

    public Task<bool> CanCurrentUserAccess(Guid otherUserId);
}