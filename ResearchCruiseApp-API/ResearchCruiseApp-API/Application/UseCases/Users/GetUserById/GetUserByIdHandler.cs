using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp_API.Application.UseCases.Users.GetUserById;

public class GetUserByIdHandler(
    IUserPermissionVerifier userPermissionVerifier,
    IIdentityService identityService)
    : IRequestHandler<GetUserByIdQuery, Result<UserDto>>
{
    public async Task<Result<UserDto>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var userDto = await identityService.GetUserDtoById(request.Id);
        
        if (userDto is null)
            return Error.NotFound();
        if (await userPermissionVerifier.CanCurrentUserAccess(userDto.Id))
            return Error.NotFound(); // Returning Forbidden would provide with too much information

        return userDto;
    }
}