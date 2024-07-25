using System.Security.Claims;
using ResearchCruiseApp_API.Models.Users;
using ResearchCruiseApp_API.Services.Common;

namespace ResearchCruiseApp_API.Services;

public interface IUsersService
{
    Task<Result<List<UserModel>>> GetAllUsers(ClaimsPrincipal currentUser);
    Task<Result<UserModel>> GetUserById(Guid id, ClaimsPrincipal currentUser);
    Task<Result> AddUser(RegisterModel registerModel, ClaimsPrincipal currentUser);
    Task<Result<List<UserModel>>> GetAllUnacceptedUsers();
    Task<Result> AcceptUser(Guid id);
    Task<Result> ToggleUserRole(Guid userId, ToggleUserRoleModel toggleUserRoleModel);
}