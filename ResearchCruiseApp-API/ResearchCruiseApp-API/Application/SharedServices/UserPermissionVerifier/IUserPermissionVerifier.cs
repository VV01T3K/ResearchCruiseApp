namespace ResearchCruiseApp_API.Application.SharedServices.UserPermissionVerifier;


public interface IUserPermissionVerifier
{
    public Task<bool> CanCurrentUserAssignRole(string roleName);

    public Task<bool> CanCurrentUserAccess(Guid otherUserId);
}