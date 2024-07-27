using System.Security.Claims;
using ResearchCruiseApp_API.Application.Common;
using ResearchCruiseApp_API.Application.DTOs.Users;

namespace ResearchCruiseApp_API.Application.Services;


public interface IUsersService
{
    Task<Result<List<UserModel>>> GetAllUsers(ClaimsPrincipal currentUser);
    Task<Result<UserModel>> GetUserById(Guid id, ClaimsPrincipal currentUser);
    Task<Result> AddUser(RegisterModel registerModel, ClaimsPrincipal currentUser);
    Task<Result<List<UserModel>>> GetAllUnacceptedUsers();
    Task<Result> AcceptUser(Guid id);
    Task<Result> ToggleUserRole(Guid userId, ToggleUserRoleModel toggleUserRoleModel);
}