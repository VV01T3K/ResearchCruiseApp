using System.Security.Claims;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Users;

namespace ResearchCruiseApp_API.Application.UseCases.Users;


public interface IUsersService
{
    Task<Result<List<UserDto>>> GetAllUsers(ClaimsPrincipal currentUser);
    Task<Result<UserDto>> GetUserById(Guid id, ClaimsPrincipal currentUser);
    Task<Result> AddUser(AddUserFormDto addUserForm, ClaimsPrincipal currentUser);
    Task<Result<List<UserDto>>> GetAllUnacceptedUsers();
    Task<Result> AcceptUser(Guid id);
    Task<Result> ToggleUserRole(Guid userId, UserRoleToggleDto userRoleToggle);
}