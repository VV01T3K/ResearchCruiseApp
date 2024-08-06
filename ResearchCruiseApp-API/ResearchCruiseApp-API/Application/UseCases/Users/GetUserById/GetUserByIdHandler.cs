using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.SharedServices.UserDtos;
using ResearchCruiseApp_API.Application.SharedServices.UserPermissionVerifier;

namespace ResearchCruiseApp_API.Application.UseCases.Users.GetUserById;

public class GetUserByIdHandler(
    IUserPermissionVerifier userPermissionVerifier,
    IUserDtosService userDtosService,
    IIdentityService identityService)
    : IRequestHandler<GetUserByIdQuery, Result<UserDto>>
{
    public async Task<Result<UserDto>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await identityService.GetUserById(request.Id);
        
        if (user == null)
            return Error.NotFound();
        if (await userPermissionVerifier.CanCurrentUserAccess(user))
            return Error.NotFound(); // Returning Forbidden would provide with too much information
  
        return await userDtosService.CreateUserDto(user);
    }
}