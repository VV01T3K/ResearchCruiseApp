using AutoMapper;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.SharedServices.UserDtos;


public class UserDtosService(UserManager<User> userManager, IMapper mapper) : IUserDtosService
{
    public async Task<UserDto> CreateUserDto(User user)
    {
        var userDto = mapper.Map<UserDto>(user);
        var userRoles = await userManager.GetRolesAsync(user);
        userDto.Roles = [..userRoles];

        return userDto;
    }
}