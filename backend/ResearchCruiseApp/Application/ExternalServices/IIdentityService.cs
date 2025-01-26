using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Account;
using ResearchCruiseApp.Application.Models.DTOs.Users;

namespace ResearchCruiseApp.Application.ExternalServices;

public interface IIdentityService
{
    Task<UserDto?> GetUserDtoById(Guid id);

    Task<List<UserDto>> GetAllUsersDtos(CancellationToken cancellationToken);

    Task<bool> UserWithIdExists(Guid id);

    Task<bool> UserWithEmailExists(string email);

    Task<Result> AcceptUser(Guid id);

    Task<Result> DeactivateUser(Guid id);

    Task<Result> ConfirmEmail(Guid userId, string code, string? changedEmail);

    Task<Result> RegisterUser(RegisterFormDto registerForm, string roleName);

    Task<bool> CanUserLogin(string email, string password);

    Task ResendEmailConfirmationEmail(string email, string roleName);

    Task<Result<LoginResponseDto>> LoginUser(string userEmail);

    Task<Result<LoginResponseDto>> RefreshUserTokens(RefreshDto refreshDto);

    Task<Result> ChangePassword(ChangePasswordFormDto changePasswordFormDto);

    Task<Result> EnablePasswordReset(ForgotPasswordFormDto forgotPasswordFormDto);

    Task<Result> ResetPassword(ResetPasswordFormDto resetPasswordFormDto);

    Task<Result> AddUserWithRole(AddUserFormDto addUserFormDto, string password, string roleName);

    Task<Result> AddRoleToUser(Guid userId, string roleName);

    Task<Result> RemoveRoleFromUser(Guid userId, string roleName);

    Task<IList<string>> GetUserRolesNames(Guid userId);

    Task<IList<string>> GetCurrentUserRoleNames();

    Task<List<string?>> GetAllRoleNames(CancellationToken cancellationToken);
    Task<Result> DeleteUser(Guid userId);
    Task<Result> UpdateUser(Guid userId, UpdateUserFormDto updateUserFormDto);
}
