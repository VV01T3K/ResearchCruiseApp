using MediatR;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Users;
using ResearchCruiseApp_API.Application.SharedServices.UserDto;
using ResearchCruiseApp_API.Application.SharedServices.UserPermissionVerifier;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.Users.GetUserById;

public class GetUserByIdHandler(
    UserManager<User> userManager,
    IUserPermissionVerifier userPermissionVerifier,
    IUserDtoService userDtoService)
    : IRequestHandler<GetUserByIdQuery, Result<UserDto>>
{
    public async Task<Result<UserDto>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(request.Id.ToString());
        
        if (user == null)
            return Error.NotFound();
        if (await userPermissionVerifier.CanUserAccessAsync(request.CurrentUser, user))
            return Error.NotFound(); // Returning Forbidden would provide with too much information
  
        return await userDtoService.CreateUserDto(user);
    }
}