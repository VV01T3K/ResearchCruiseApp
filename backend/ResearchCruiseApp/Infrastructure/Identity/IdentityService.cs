using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NeoSmart.Utils;
using ResearchCruiseApp.Api.Account.Contracts;
using ResearchCruiseApp.Api.Common.Constants;
using ResearchCruiseApp.Api.Common.ServiceResult;
using ResearchCruiseApp.Api.Users;
using ResearchCruiseApp.Api.Users.Contracts;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Infrastructure.Identity;

internal class IdentityService(
    UserManager<User> userManager,
    RoleManager<IdentityRole> roleManager,
    IEmailSender emailSender,
    IRandomGenerator randomGenerator,
    ICurrentUserService currentUserService,
    IConfiguration configuration,
    ApplicationDbContext dbContext
) : IIdentityService
{
    public async Task<UserDto?> GetUserDtoById(Guid id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        return user is null ? null : await CreateUserDto(user);
    }

    public async Task<List<UserDto>> GetAllUsersDtos(CancellationToken cancellationToken)
    {
        var users = await userManager.Users.ToListAsync(cancellationToken);
        var usersDtos = new List<UserDto>();

        foreach (var user in users)
        {
            usersDtos.Add(await CreateUserDto(user));
        }

        return usersDtos;
    }

    public async Task<List<CruiseManagerOptionDto>> GetAllCruiseManagersDtos(
        CancellationToken cancellationToken
    )
    {
        var roleNames = new[]
        {
            RoleName.Administrator,
            RoleName.Shipowner,
            RoleName.CruiseManager,
        };

        var users = new List<User>();

        foreach (var roleName in roleNames)
        {
            var roleUsers = await userManager.GetUsersInRoleAsync(roleName);
            users.AddRange(roleUsers);
        }

        var distinctUsers = users.DistinctBy(u => u.Id).Where(u => u.Accepted).ToList();

        return distinctUsers.Select(UserMappings.ToCruiseManagerOptionDto).ToList();
    }

    public async Task<bool> UserWithIdExists(Guid id)
    {
        return await userManager.FindByIdAsync(id.ToString()) is not null;
    }

    public async Task<bool> UserWithEmailExists(string email)
    {
        return await userManager.FindByEmailAsync(email) is not null;
    }

    public async Task<Result> AcceptUser(Guid id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        if (user is null)
            return Error.ResourceNotFound();

        user.Accepted = true;

        var identityResult = await userManager.UpdateAsync(user);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult();

        await emailSender.SendAccountAcceptedMessage(await CreateUserDto(user));

        return Result.Empty;
    }

    public async Task<Result> DeactivateUser(Guid id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        if (user is null)
            return Error.ForbiddenOperation();

        user.Accepted = false;

        var identityResult = await userManager.UpdateAsync(user);

        return identityResult.Succeeded ? Result.Empty : identityResult.ToApplicationResult();
    }

    public async Task<Result> ConfirmEmail(Guid userId, string code)
    {
        if (await userManager.FindByIdAsync(userId.ToString()) is not { } user)
            return Error.UnknownIdentity();

        try
        {
            code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
        }
        catch (FormatException)
        {
            return Error.UnknownIdentity();
        }

        var result = await userManager.ConfirmEmailAsync(user, code);

        return result.Succeeded ? Result.Empty : Error.UnknownIdentity();
    }

    public async Task<Result> RegisterUser(RegisterFormDto registerForm, string roleName)
    {
        if (!userManager.SupportsUserEmail)
            return Error.ServiceUnavailable();

        var user = CreateUser(registerForm);
        var identityResult = await userManager.CreateAsync(user, registerForm.Password);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult();

        identityResult = await userManager.AddToRoleAsync(user, roleName);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult();

        var emailConfirmationCode = await CreateEmailConfirmationCode(user);
        await emailSender.SendEmailConfirmationEmail(
            await CreateUserDto(user),
            roleName,
            emailConfirmationCode
        );

        return identityResult.ToApplicationResult();
    }

    public async Task<bool> CanUserLogin(string email, string password)
    {
        var user = await userManager.FindByEmailAsync(email);
        return user is { Accepted: true, EmailConfirmed: true }
            && await userManager.CheckPasswordAsync(user, password);
    }

    public async Task ResendEmailConfirmationEmail(string email, string roleName)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
            return; // According to Microsoft, responding with an error would give to much information

        var emailConfirmationCode = await CreateEmailConfirmationCode(user);
        var userDto = await CreateUserDto(user);

        await emailSender.SendEmailConfirmationEmail(userDto, roleName, emailConfirmationCode);
    }

    public async Task<Result<LoginResponseDto>> LoginUser(string userEmail)
    {
        var user = await userManager.FindByEmailAsync(userEmail);
        if (user is null)
            return Error.UnknownIdentity();

        return await CreateLoginResponseDto(user);
    }

    public async Task<Result<LoginResponseDto>> RefreshUserTokens(RefreshDto refreshDto)
    {
        var userIdResult = GetUserIdFromAccessToken(refreshDto.AccessToken);
        if (userIdResult.Error is not null)
            return userIdResult.Error;

        var user = await userManager.FindByIdAsync(userIdResult.Data!);
        if (
            user is null
            || user.RefreshTokenExpiry < DateTime.UtcNow
            || user.RefreshToken != refreshDto.RefreshToken
        )
        {
            return Error.UnknownIdentity();
        }
        return await CreateLoginResponseDto(user);
    }

    public async Task<Result> ChangePassword(ChangePasswordFormDto changePasswordFormDto)
    {
        var userId = currentUserService.GetId();
        if (userId is null)
            return Error.ResourceNotFound();

        var user = await userManager.FindByIdAsync(userId.ToString()!);
        if (user is null)
            return Error.ResourceNotFound();

        var identityResult = await userManager.ChangePasswordAsync(
            user,
            changePasswordFormDto.Password,
            changePasswordFormDto.NewPassword
        );

        if (!identityResult.Succeeded)
            return Error.InvalidArgument();

        await userManager.UpdateAsync(user);
        return Result.Empty;
    }

    public async Task<Result> EnablePasswordReset(ForgotPasswordFormDto forgotPasswordFormDto)
    {
        var user = await userManager.FindByEmailAsync(forgotPasswordFormDto.Email);
        if (user is null)
            return Error.ResourceNotFound();

        var code = await userManager.GeneratePasswordResetTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

        var userDto = await GetUserDtoById(Guid.Parse(user.Id));
        if (userDto is null)
            return Error.ResourceNotFound();

        await emailSender.SendPasswordResetMessage(userDto, code);

        return Result.Empty;
    }

    public async Task<Result> ResetPassword(ResetPasswordFormDto resetPasswordFormDto)
    {
        var emailBytes = UrlBase64.Decode(resetPasswordFormDto.EmailBase64);
        if (emailBytes is null)
            return Error.UnknownIdentity();

        var email = Encoding.UTF8.GetString(emailBytes);
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
            return Error.ForbiddenOperation();

        var resetCodeBytes = UrlBase64.Decode(resetPasswordFormDto.ResetCode);
        if (resetCodeBytes is null)
            return Error.UnknownIdentity();

        var resetCode = Encoding.UTF8.GetString(resetCodeBytes);
        var result = await userManager.ResetPasswordAsync(
            user,
            resetCode,
            resetPasswordFormDto.Password
        );

        return result.Succeeded ? Result.Empty : Error.UnknownIdentity();
    }

    public async Task<Result> AddUserWithRoles(
        string email,
        string firstName,
        string lastName,
        string password,
        IReadOnlyCollection<string> roleNames
    )
    {
        var user = CreateUser(email, firstName, lastName, true, true);
        var identityResult = await userManager.CreateAsync(user, password);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult();

        identityResult = await userManager.AddToRolesAsync(user, roleNames);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult();

        var userDto = await CreateUserDto(user);
        await emailSender.SendAccountCreatedMessage(userDto, roleNames.First(), password);

        return Result.Empty;
    }

    public async Task<IList<string>> GetUserRolesNames(Guid userId)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return [];

        return await userManager.GetRolesAsync(user);
    }

    public async Task<IList<string>> GetCurrentUserRoleNames()
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
            return [];

        var currentUser = await userManager.FindByIdAsync(currentUserId.ToString()!);
        if (currentUser is null)
            return [];

        return await userManager.GetRolesAsync(currentUser);
    }

    public Task<List<string?>> GetAllRoleNames(CancellationToken cancellationToken)
    {
        return roleManager.Roles.Select(role => role.Name).ToListAsync(cancellationToken);
    }

    public async Task<Result> DeleteUser(Guid userId, CancellationToken cancellationToken = default)
    {
        var userRoles = await GetUserRolesNames(userId);
        if (!userRoles.Contains(RoleName.Administrator))
            return await DeleteUserCore(userId);

        return await ExecuteAdminInvariantGuarded(
            userId,
            "Nie można usunąć ostatniego administratora",
            () => DeleteUserCore(userId),
            cancellationToken
        );
    }

    public async Task<Result> UpdateUser(
        Guid userId,
        string? email,
        string? firstName,
        string? lastName,
        CancellationToken cancellationToken = default
    )
    {
        return await UpdateUserCore(userId, email, firstName, lastName);
    }

    public async Task<Result> AddUserRole(
        Guid userId,
        string roleName,
        CancellationToken cancellationToken = default
    )
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ResourceNotFound();

        var identityResult = await userManager.AddToRoleAsync(user, roleName);
        return identityResult.Succeeded ? Result.Empty : identityResult.ToApplicationResult();
    }

    public async Task<Result> RemoveUserRole(
        Guid userId,
        string roleName,
        CancellationToken cancellationToken = default
    )
    {
        if (roleName != RoleName.Administrator)
            return await RemoveUserRoleCore(userId, roleName);

        return await ExecuteAdminInvariantGuarded(
            userId,
            "Nie można odebrać roli ostatniemu administratorowi",
            () => RemoveUserRoleCore(userId, roleName),
            cancellationToken
        );
    }

    private async Task<Result> DeleteUserCore(Guid userId)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ForbiddenOperation();

        var identityResult = await userManager.DeleteAsync(user);

        return identityResult.Succeeded ? Result.Empty : identityResult.ToApplicationResult();
    }

    private async Task<int> GetUsersCountInRole(string roleName)
    {
        var usersInRole = await userManager.GetUsersInRoleAsync(roleName);
        return usersInRole.Count;
    }

    private async Task<Result> ExecuteAdminInvariantGuarded(
        Guid userId,
        string conflictMessage,
        Func<Task<Result>> mutation,
        CancellationToken cancellationToken
    )
    {
        await using var transaction = await dbContext.Database.BeginTransactionAsync(
            System.Data.IsolationLevel.Serializable,
            cancellationToken
        );

        var userRoles = await GetUserRolesNames(userId);
        if (userRoles.Contains(RoleName.Administrator))
        {
            var adminCount = await GetUsersCountInRole(RoleName.Administrator);
            if (adminCount <= 1)
                return Error.Conflict(conflictMessage);
        }

        var result = await mutation();
        await transaction.CommitAsync(cancellationToken);
        return result;
    }

    private async Task<Result> UpdateUserCore(
        Guid userId,
        string? email,
        string? firstName,
        string? lastName
    )
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ForbiddenOperation();

        if (email is not null && email != user.Email && await UserWithEmailExists(email))
            return Error.Conflict("Użytkownik o tym adresie e-mail już istnieje");

        user.EmailConfirmed = (email == user.Email || email is null) && user.EmailConfirmed;
        user.Email = email ?? user.Email;
        user.FirstName = firstName ?? user.FirstName;
        user.LastName = lastName ?? user.LastName;

        var identityResult = await userManager.UpdateAsync(user);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult();

        var userRoles = await userManager.GetRolesAsync(user);

        if (user is { EmailConfirmed: false, Email: not null })
        {
            await ResendEmailConfirmationEmail(user.Email, userRoles.First());
        }

        return Result.Empty;
    }

    private async Task<Result> RemoveUserRoleCore(Guid userId, string roleName)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ResourceNotFound();

        var identityResult = await userManager.RemoveFromRoleAsync(user, roleName);
        return identityResult.Succeeded ? Result.Empty : identityResult.ToApplicationResult();
    }

    private static User CreateUser(RegisterFormDto registerFormDto) =>
        CreateUser(
            registerFormDto.Email,
            registerFormDto.FirstName,
            registerFormDto.LastName,
            false
        );

    private static User CreateUser(
        string email,
        string firstName,
        string lastName,
        bool accepted,
        bool emailConfirmed = false
    )
    {
        return new User
        {
            UserName = email,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            Accepted = accepted,
            EmailConfirmed = emailConfirmed,
        };
    }

    private async Task<UserDto> CreateUserDto(User user)
    {
        var userDto = UserMappings.ToUserDto(user);
        userDto.Roles = await GetUserRolesNames(userDto.Id);

        return userDto;
    }

    private async Task<Result<LoginResponseDto>> CreateLoginResponseDto(User user)
    {
        var accessTokenResult = await CreateAccessToken(user);
        if (!accessTokenResult.IsSuccess)
            return accessTokenResult.Error!;
        var accessToken = accessTokenResult.Data;

        var (refreshToken, refreshTokenExpiry) = CreateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = refreshTokenExpiry;

        var identityResult = await userManager.UpdateAsync(user);
        var concurrencyError = identityResult.Errors.FirstOrDefault(error =>
            error.Code == nameof(IdentityErrorDescriber.ConcurrencyFailure)
        );

        if (concurrencyError is not null)
            return Error.Conflict("Wykonano wiele żądań w zbyt krótkim odstępie czasowym.");
        if (!identityResult.Succeeded)
            return Error.ServerError();

        var loginResponseDto = new LoginResponseDto
        {
            AccessToken = new JwtSecurityTokenHandler().WriteToken(accessToken),
            AccessTokenExpirationDate = accessToken?.ValidTo ?? DateTime.UtcNow,
            RefreshToken = refreshToken,
            RefreshTokenExpirationDate = refreshTokenExpiry.ToUniversalTime(),
        };
        return loginResponseDto;
    }

    private async Task<string> CreateEmailConfirmationCode(User user)
    {
        var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

        return code;
    }

    private async Task<Result<JwtSecurityToken>> CreateAccessToken(User user)
    {
        var issuer = configuration["JWT:ValidIssuer"];
        var audience = configuration["JWT:ValidAudience"];
        var lifetime = int.Parse(configuration["JWT:AccessTokenLifetimeSeconds"] ?? "0");

        if (issuer is null || audience is null)
            return Error.ServerError();

        var authenticationClaims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var roles = await userManager.GetRolesAsync(user);
        authenticationClaims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var securityKeyResult = CreateSecurityKey();
        if (securityKeyResult.Error is not null)
            return securityKeyResult.Error;

        var securityKey = securityKeyResult.Data;
        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            expires: DateTime.UtcNow.AddSeconds(lifetime),
            claims: authenticationClaims,
            signingCredentials: new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256)
        );

        return token;
    }

    private (string token, DateTime expiry) CreateRefreshToken()
    {
        var lifetime = int.Parse(configuration["JWT:RefreshTokenLifetimeSeconds"] ?? "0");
        var expiry = DateTime.UtcNow.AddSeconds(lifetime);
        var token = Convert.ToBase64String(randomGenerator.CreateSecureCodeBytes());

        return (token, expiry);
    }

    private Result<string> GetUserIdFromAccessToken(string accessToken)
    {
        var securityKeyResult = CreateSecurityKey();
        if (securityKeyResult.Error is not null)
            return securityKeyResult.Error;

        var validation = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = false, // We want to get the user id even from an expired token
            ValidAudience = configuration["JWT:ValidAudience"],
            ValidIssuer = configuration["JWT:ValidIssuer"],
            IssuerSigningKey = securityKeyResult.Data,
        };

        try
        {
            var principal = new JwtSecurityTokenHandler().ValidateToken(
                accessToken,
                validation,
                out _
            );
            if (principal is null)
                return Error.UnknownIdentity();

            var userName = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userName is null)
                return Error.UnknownIdentity();

            return userName;
        }
        catch (SecurityTokenArgumentException)
        {
            return Error.UnknownIdentity();
        }
    }

    private Result<SymmetricSecurityKey> CreateSecurityKey()
    {
        var secret = configuration["JWT:Secret"];
        if (secret is null)
            return Error.ServerError();

        return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
    }
}
