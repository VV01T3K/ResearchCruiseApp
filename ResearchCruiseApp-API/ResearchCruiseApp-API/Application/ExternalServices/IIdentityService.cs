using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Account;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface IIdentityService
{
    Task<User?> GetUserById(Guid id);
    Task<List<User>> GetAllUsers(CancellationToken cancellationToken);
    Task<bool> UserWithEmailExists(string email);
    Task<Result> AcceptUser(Guid id);
    Task<Result> RegisterUser(RegisterFormDto registerForm, string roleName, CancellationToken cancellationToken);
    Task<Result> AddUserWithRole(User user, string password, string roleName);
    Task<Result> AddRoleToUser(User user, string roleName);
    Task<Result> RemoveRoleFromUser(User user, string roleName);
    Task<IList<string>> GetUserRolesNames(User user);
    Task<IList<string>> GetCurrentUserRoleNames();
    Task<List<string?>> GetAllRoleNames(CancellationToken cancellationToken);
}