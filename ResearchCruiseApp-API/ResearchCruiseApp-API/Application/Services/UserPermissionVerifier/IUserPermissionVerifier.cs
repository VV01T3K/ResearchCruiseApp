using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;


public interface IUserPermissionVerifier
{
    Task<bool> CanCurrentUserAssignRole(string roleName);
    
    Task<bool> CanCurrentUserAccess(Guid otherUserId);
    
    Task<bool> CanCurrentUserViewCruiseApplication(CruiseApplication cruiseApplication);
    
    Task<bool> CanCurrentUserViewCruise(Cruise cruise);
    
    Task<bool> CanCurrentUserAddFormB(CruiseApplication cruiseApplication);

    Task<bool> CanCurrentUserViewFormB(CruiseApplication cruiseApplication);
}