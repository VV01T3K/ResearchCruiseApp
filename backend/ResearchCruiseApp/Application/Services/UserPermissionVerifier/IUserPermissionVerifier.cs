using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.UserPermissionVerifier;

public interface IUserPermissionVerifier
{
    Task<bool> CanCurrentUserAssignRole(string roleName);

    Task<bool> CanCurrentUserAccess(Guid otherUserId);

    Task<bool> CanCurrentUserViewCruiseApplication(CruiseApplication cruiseApplication);

    Task<bool> CanCurrentUserViewCruise(Cruise cruise);

    Task<bool> CanCurrentUserAddForm(CruiseApplication cruiseApplication);

    Task<bool> CanCurrentUserViewForm(CruiseApplication cruiseApplication);

    Task<bool> CanCurrentUserUpdateEffects(CruiseApplication cruiseApplication);

    Task<bool> CanUserDeactivate(Guid otherUserId);
    Task<bool> CanUserDeleteOtherUsers(Guid otherUserId);
}
