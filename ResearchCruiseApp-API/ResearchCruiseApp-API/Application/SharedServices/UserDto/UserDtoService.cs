using AutoMapper;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.SharedServices.UserDto;


public class UserDtoService(UserManager<User> userManager, IMapper mapper) : IUserDtoService
{
    public async Task<Models.DTOs.Users.UserDto> CreateUserDto(User user)
    {
        var userDto = mapper.Map<Models.DTOs.Users.UserDto>(user);
        var userRoles = await userManager.GetRolesAsync(user);
        userDto.Roles = [..userRoles];

        return userDto;
    }
}