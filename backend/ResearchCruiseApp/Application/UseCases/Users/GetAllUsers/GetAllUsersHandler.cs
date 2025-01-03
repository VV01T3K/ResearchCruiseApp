using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Users;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Application.UseCases.Users.GetAllUsers;

public class GetAllUsersHandler(
    IUserPermissionVerifier userPermissionVerifier,
    IIdentityService identityService
) : IRequestHandler<GetAllUsersQuery, Result<List<UserDto>>>
{
    public async Task<Result<List<UserDto>>> Handle(
        GetAllUsersQuery request,
        CancellationToken cancellationToken
    )
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
