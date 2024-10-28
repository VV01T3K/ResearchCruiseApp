using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;


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
}