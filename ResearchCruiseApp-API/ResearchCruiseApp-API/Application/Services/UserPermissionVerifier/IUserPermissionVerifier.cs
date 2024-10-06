using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;


public interface IUserPermissionVerifier
{
    public Task<bool> CanCurrentUserAssignRole(string roleName);

    public Task<bool> CanCurrentUserAccess(Guid otherUserId);

    public Task<bool> CanCurrentUserViewCruiseApplication(CruiseApplication cruiseApplication);

    public Task<bool> CanCurrentUserViewCruise(Cruise cruise);
}