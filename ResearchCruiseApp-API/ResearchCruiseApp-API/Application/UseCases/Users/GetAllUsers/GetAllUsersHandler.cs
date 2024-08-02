using MediatR;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Users;
using ResearchCruiseApp_API.Application.SharedServices.UserDto;
using ResearchCruiseApp_API.Application.SharedServices.UserPermissionVerifier;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Application.UseCases.Users.GetAllUsers;


public class GetAllUsersHandler(
    ApplicationDbContext applicationDbContext,
    IUserPermissionVerifier userPermissionVerifier,
    IUserDtoService userDtoService)
    : IRequestHandler<GetAllUsersQuery, Result<List<UserDto>>>
{
    public async Task<Result<List<UserDto>>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var allUsers = await applicationDbContext.Users.ToListAsync(cancellationToken);

        var userDtos = new List<UserDto>();
        foreach (var user in allUsers)
        {
            if (await userPermissionVerifier.CanUserAccessAsync(request.CurrentUser, user))
                userDtos.Add(await userDtoService.CreateUserDto(user));
        }
            
        return userDtos;
    }
}