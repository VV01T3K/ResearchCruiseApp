using System.Security.Claims;
using ResearchCruiseApp_API.Application.Common.Models;
using ResearchCruiseApp_API.Application.UseCaseServices.Users.DTOs;

namespace ResearchCruiseApp_API.Application.UseCaseServices.Users;


public interface IUsersService
{
    Task<Result<List<UserDto>>> GetAllUsers(ClaimsPrincipal currentUser);
    Task<Result<UserDto>> GetUserById(Guid id, ClaimsPrincipal currentUser);
    Task<Result> AddUser(AddUserFormDto addUserForm, ClaimsPrincipal currentUser);
    Task<Result<List<UserDto>>> GetAllUnacceptedUsers();
    Task<Result> AcceptUser(Guid id);
    Task<Result> ToggleUserRole(Guid userId, UserRoleToggleDto userRoleToggle);
}