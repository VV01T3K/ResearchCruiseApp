using MediatR;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Users;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp_API.Application.UseCases.Users.GetAllUsers;


public class GetAllUsersHandler(
    IUserPermissionVerifier userPermissionVerifier,
    IIdentityService identityService)
    : IRequestHandler<GetAllUsersQuery, Result<List<UserDto>>>
{
    public async Task<Result<List<UserDto>>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var allUsersDtos = await identityService.GetAllUsersDtos(cancellationToken);
        var permittedUsersDtos = new List<UserDto>();
        
        foreach (var userDto in allUsersDtos)
        {
            if (await userPermissionVerifier.CanCurrentUserAccess(userDto.Id))
                permittedUsersDtos.Add(userDto);
        }
            
        return permittedUsersDtos;
    }
}