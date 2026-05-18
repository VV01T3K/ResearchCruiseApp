using ResearchCruiseApp.Results;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;

namespace ResearchCruiseApp.Infrastructure.Identity;

public interface IIdentityService
{
    Task<UserDto?> GetUserDtoById(Guid id);

    Task<List<UserDto>> GetAllUsersDtos(CancellationToken cancellationToken);
    Task<List<CruiseManagerOptionDto>> GetAllCruiseManagersDtos(
        CancellationToken cancellationToken
    );

    Task<bool> UserWithIdExists(Guid id);

    Task<bool> UserWithEmailExists(string email);

    Task<Result> AcceptUser(Guid id);

    Task<Result> DeactivateUser(Guid id);

    Task<Result> ConfirmEmail(Guid userId, string code);

    Task<Result> RegisterUser(RegisterFormDto registerForm, string roleName);

    Task<bool> CanUserLogin(string email, string password);

    Task ResendEmailConfirmationEmail(string email, string roleName);

    Task<Result<LoginResponseDto>> LoginUser(string userEmail);

    Task<Result<LoginResponseDto>> RefreshUserTokens(RefreshDto refreshDto);

    Task<Result> ChangePassword(ChangePasswordFormDto changePasswordFormDto);

    Task<Result> EnablePasswordReset(ForgotPasswordFormDto forgotPasswordFormDto);

    Task<Result> ResetPassword(ResetPasswordFormDto resetPasswordFormDto);

    Task<Result> AddUserWithRoles(
        string email,
        string firstName,
        string lastName,
        string password,
        IReadOnlyCollection<string> roleNames
    );

    Task<IList<string>> GetUserRolesNames(Guid userId);

    Task<IList<string>> GetCurrentUserRoleNames();

    Task<List<string?>> GetAllRoleNames(CancellationToken cancellationToken);

    Task<Result> DeleteUser(Guid userId, CancellationToken cancellationToken = default);
    Task<Result> UpdateUser(
        Guid userId,
        string? email,
        string? firstName,
        string? lastName,
        CancellationToken cancellationToken = default
    );
    Task<Result> AddUserRole(
        Guid userId,
        string roleName,
        CancellationToken cancellationToken = default
    );
    Task<Result> RemoveUserRole(
        Guid userId,
        string roleName,
        CancellationToken cancellationToken = default
    );
}
