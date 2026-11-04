using System.Collections.Immutable;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NeoSmart.Utils;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Infrastructure.Identity;

internal enum SeedUserStatus
{
    AlreadyComplete,
    Created,
}

internal class IdentityService(
    UserManager<User> userManager,
    RoleManager<IdentityRole> roleManager,
    EmailSender emailSender,
    RandomGenerator randomGenerator,
    CurrentUserService currentUserService,
    IOptions<JwtSettings> jwtSettings,
    ApplicationDbContext dbContext,
    TimeProvider clock,
    ILogger<IdentityService> logger
)
{
    private const string SecurityStampHashClaim = "security_stamp_hash";

    internal static readonly ImmutableArray<string> CruiseManagerRoleNames =
    [
        RoleName.Administrator,
        RoleName.Shipowner,
        RoleName.CruiseManager,
    ];

    public async Task<UserDto?> GetUserDtoById(Guid id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        return user is null ? null : await CreateUserDto(user);
    }

    public async Task<List<UserDto>> GetAllUsersDtos(CancellationToken cancellationToken)
    {
        var users = await userManager.Users.ToListAsync(cancellationToken);
        var userRoles = await (
            from userRole in dbContext.UserRoles
            join role in dbContext.Roles on userRole.RoleId equals role.Id
            select new { userRole.UserId, role.Name }
        ).ToListAsync(cancellationToken);
        var rolesByUserId = userRoles.ToLookup(
            userRole => userRole.UserId,
            userRole => userRole.Name!
        );

        return users
            .Select(user =>
            {
                var userDto = UserMappings.ToUserDto(user);
                userDto.Roles = rolesByUserId[user.Id].ToList();
                return userDto;
            })
            .ToList();
    }

    public async Task<Dictionary<Guid, CruiseManagerOptionDto>> GetCruiseManagerOptionsByIds(
        IEnumerable<Guid> ids,
        CancellationToken cancellationToken
    )
    {
        var userIds = ids.Select(id => id.ToString()).Distinct().ToList();
        var users = await userManager
            .Users.Where(user => userIds.Contains(user.Id))
            .ToListAsync(cancellationToken);

        return users.Select(UserMappings.ToCruiseManagerOptionDto).ToDictionary(user => user.Id);
    }

    public async Task<List<CruiseManagerOptionDto>> GetAllCruiseManagersDtos(
        CancellationToken cancellationToken
    )
    {
        var users = new List<User>();

        foreach (var roleName in CruiseManagerRoleNames)
        {
            var roleUsers = await userManager.GetUsersInRoleAsync(roleName);
            users.AddRange(roleUsers);
        }

        var distinctUsers = users.DistinctBy(u => u.Id).Where(u => u.Accepted).ToList();

        return distinctUsers.Select(UserMappings.ToCruiseManagerOptionDto).ToList();
    }

    public async Task<bool> IsActiveWithAnyRole(Guid id, IEnumerable<string> roleNames)
    {
        var userId = id.ToString();
        var names = roleNames.ToArray();
        return await (
            from userRole in dbContext.UserRoles
            join role in dbContext.Roles on userRole.RoleId equals role.Id
            join user in dbContext.Users on userRole.UserId equals user.Id
            where user.Id == userId && user.Accepted && names.Contains(role.Name!)
            select userRole
        ).AnyAsync();
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
        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;

        var identityResult = await userManager.UpdateSecurityStampAsync(user);

        return identityResult.Succeeded ? Result.Empty : identityResult.ToApplicationResult();
    }

    public async Task<Result> ConfirmEmail(Guid userId, string code)
    {
        var invalidLink = Error.InvalidArgument(
            "Link potwierdzający jest nieprawidłowy lub wygasł."
        );

        if (await userManager.FindByIdAsync(userId.ToString()) is not { } user)
            return invalidLink;

        try
        {
            code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
        }
        catch (FormatException)
        {
            return invalidLink;
        }

        var result = await userManager.ConfirmEmailAsync(user, code);

        return result.Succeeded ? Result.Empty : invalidLink;
    }

    public async Task<Result> RegisterUser(RegisterFormDto registerForm, string roleName)
    {
        await using var transaction = await dbContext.Database.BeginTransactionAsync();

        if (!userManager.SupportsUserEmail)
            return Error.ServiceUnavailable();

        var alreadyTaken = IdentityResult
            .Failed(userManager.ErrorDescriber.DuplicateEmail(registerForm.Email))
            .ToApplicationResult();
        var normalizedEmail = userManager.NormalizeEmail(registerForm.Email);
        var users = await userManager
            .Users.Where(candidate => candidate.NormalizedEmail == normalizedEmail)
            .Take(2)
            .ToListAsync();
        var user = users.FirstOrDefault();
        if (
            users.Count > 1
            || user is { EmailConfirmed: true } or { Accepted: true }
            || user is not null && await IsReferenced(Guid.Parse(user.Id))
        )
            return alreadyTaken;

        IdentityResult identityResult;
        if (user is null)
        {
            user = CreateUser(registerForm);
            try
            {
                identityResult = await userManager.CreateAsync(user);
            }
            catch (DbUpdateException exception)
                when (exception.InnerException is SqlException { Number: 2601 } sqlException
                    && sqlException.Message.Contains("UserNameIndex")
                )
            {
                return alreadyTaken;
            }
            if (identityResult.Succeeded)
                identityResult = await userManager.AddToRoleAsync(user, roleName);
        }
        else
        {
            identityResult = await userManager.RemovePasswordAsync(user);
        }
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult();

        await SendRegistrationEmail(user);

        await transaction.CommitAsync();
        return identityResult.ToApplicationResult();
    }

    private async Task<bool> IsReferenced(Guid userId) =>
        await dbContext.FormsA.AnyAsync(form =>
            form.CruiseManagerId == userId || form.DeputyManagerId == userId
        )
        || await dbContext.Cruises.AnyAsync(cruise =>
            cruise.MainCruiseManagerId == userId || cruise.MainDeputyManagerId == userId
        )
        || await dbContext.UserPublications.AnyAsync(publication => publication.UserId == userId)
        || await dbContext.UserEffects.AnyAsync(effect => effect.UserId == userId);

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
            return; // According to Microsoft, responding with an error would give too much information
        if (user.PasswordHash is null)
        {
            await SendRegistrationEmail(user);
            return;
        }

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

    public async Task<Result<LoginResponseDto>> RefreshUserTokens(string refreshToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
            return Error.UnknownIdentity();

        var refreshTokenHash = HashToken(refreshToken);
        var user = await userManager.Users.SingleOrDefaultAsync(candidate =>
            candidate.RefreshToken == refreshTokenHash
        );
        if (
            user is null
            || !user.Accepted
            || !user.EmailConfirmed
            || user.RefreshTokenExpiry is null
            || user.RefreshTokenExpiry < clock.GetUtcNow().UtcDateTime
        )
            return Error.UnknownIdentity();

        return await CreateLoginResponseDto(user);
    }

    public async Task RevokeRefreshToken(string refreshToken)
    {
        var refreshTokenHash = HashToken(refreshToken);
        await RevokeRefreshToken(user => user.RefreshToken == refreshTokenHash);
    }

    public async Task RevokeRefreshToken(Guid userId)
    {
        await RevokeRefreshToken(user => user.Id == userId.ToString());
    }

    private async Task RevokeRefreshToken(Expression<Func<User, bool>> userPredicate)
    {
        await userManager
            .Users.Where(userPredicate)
            .ExecuteUpdateAsync(properties =>
                properties
                    .SetProperty(user => user.RefreshToken, (string?)null)
                    .SetProperty(user => user.RefreshTokenExpiry, (DateTime?)null)
                    .SetProperty(user => user.ConcurrencyStamp, Guid.NewGuid().ToString())
                    .SetProperty(user => user.SecurityStamp, Guid.NewGuid().ToString())
            );
    }

    public async Task<bool> IsAccessTokenCurrent(ClaimsPrincipal principal)
    {
        var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var securityStamp = await userManager
            .Users.Where(user => user.Id == userId)
            .Select(user => user.SecurityStamp)
            .SingleOrDefaultAsync();

        return securityStamp is not null
            && HashToken(securityStamp) == principal.FindFirstValue(SecurityStampHashClaim);
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

        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;
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
        var invalidLink = Error.InvalidArgument(
            "Link do ustawienia hasła jest nieprawidłowy lub wygasł."
        );

        string email;
        string resetCode;
        try
        {
            email = Encoding.UTF8.GetString(UrlBase64.Decode(resetPasswordFormDto.EmailBase64));
            resetCode = Encoding.UTF8.GetString(UrlBase64.Decode(resetPasswordFormDto.ResetCode));
        }
        catch (FormatException)
        {
            return invalidLink;
        }

        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
            return invalidLink;

        var refreshToken = user.RefreshToken;
        var refreshTokenExpiry = user.RefreshTokenExpiry;
        var emailConfirmed = user.EmailConfirmed;
        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;
        if (user.PasswordHash is null)
            user.EmailConfirmed = true;
        var result = await userManager.ResetPasswordAsync(
            user,
            resetCode,
            resetPasswordFormDto.Password
        );

        if (result.Succeeded)
            return Result.Empty;

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = refreshTokenExpiry;
        user.EmailConfirmed = emailConfirmed;
        return invalidLink;
    }

    public async Task<Result<SeedUserStatus>> EnsureSeedUserWithRole(
        string email,
        string firstName,
        string lastName,
        string password,
        string roleName
    )
    {
        var existingTransaction = dbContext.Database.CurrentTransaction;
        await using var transaction = existingTransaction is null
            ? await dbContext.Database.BeginTransactionAsync()
            : null;
        var savepoint = Guid.NewGuid().ToString("N");
        if (existingTransaction is not null)
            await existingTransaction.CreateSavepointAsync(savepoint);

        try
        {
            var result = await EnsureSeedUserCore(email, firstName, lastName, password, roleName);
            if (!result.IsSuccess)
            {
                if (existingTransaction is not null)
                    await existingTransaction.RollbackToSavepointAsync(savepoint);
                return result;
            }

            if (transaction is not null)
                await transaction.CommitAsync();
            else
                await existingTransaction!.ReleaseSavepointAsync(savepoint);
            return result;
        }
        catch
        {
            if (existingTransaction is not null)
                await existingTransaction.RollbackToSavepointAsync(savepoint);
            throw;
        }
    }

    private async Task<Result<SeedUserStatus>> EnsureSeedUserCore(
        string email,
        string firstName,
        string lastName,
        string password,
        string roleName
    )
    {
        var existingUser = await userManager.FindByEmailAsync(email);
        if (existingUser is not null)
        {
            if (await userManager.IsInRoleAsync(existingUser, roleName))
                return SeedUserStatus.AlreadyComplete;

            var deleteResult = await userManager.DeleteAsync(existingUser);
            if (!deleteResult.Succeeded)
                return deleteResult.ToApplicationResult().Error!;
        }

        var result = await CreateUserWithRoles(email, firstName, lastName, password, [roleName]);
        if (!result.IsSuccess)
            return result.Error!;

        try
        {
            await emailSender.SendAccountCreatedMessage(
                await CreateUserDto(result.Data!),
                roleName,
                password
            );
        }
        catch (Exception exception)
        {
            logger.LogWarning(exception, "Seed user notification could not be queued");
            throw;
        }

        return SeedUserStatus.Created;
    }

    public async Task<Result> AddUserWithRoles(
        string email,
        string firstName,
        string lastName,
        string password,
        IReadOnlyCollection<string> roleNames
    )
    {
        var result = await CreateUserWithRoles(email, firstName, lastName, password, roleNames);
        if (!result.IsSuccess)
            return result.Error!;

        await emailSender.SendAccountCreatedMessage(
            await CreateUserDto(result.Data!),
            roleNames.First(),
            password
        );

        return Result.Empty;
    }

    private async Task<Result<User>> CreateUserWithRoles(
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
            return identityResult.ToApplicationResult().Error!;

        identityResult = await userManager.AddToRolesAsync(user, roleNames);
        if (identityResult.Succeeded)
            return user;

        var deleteResult = await userManager.DeleteAsync(user);
        return (deleteResult.Succeeded ? identityResult : deleteResult)
            .ToApplicationResult()
            .Error!;
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
            () => DeleteUserCore(userId)
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
            () => RemoveUserRoleCore(userId, roleName)
        );
    }

    public async Task<Result> ReplaceUserRoles(Guid userId, string roleName)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ResourceNotFound();

        var currentRoles = await userManager.GetRolesAsync(user);
        if (
            roleName != RoleName.Administrator
            && currentRoles.Contains(RoleName.Administrator)
            && await GetUsersCountInRole(RoleName.Administrator) <= 1
        )
        {
            return Error.Conflict("Nie można odebrać roli ostatniemu administratorowi");
        }

        var identityResult = await userManager.RemoveFromRolesAsync(
            user,
            currentRoles.Where(currentRole => currentRole != roleName)
        );
        if (identityResult.Succeeded && !currentRoles.Contains(roleName))
            identityResult = await userManager.AddToRoleAsync(user, roleName);

        return identityResult.ToApplicationResult();
    }

    private async Task<Result> DeleteUserCore(Guid userId)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ResourceNotFound();

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
        Func<Task<Result>> mutation
    )
    {
        var userRoles = await GetUserRolesNames(userId);
        if (userRoles.Contains(RoleName.Administrator))
        {
            var adminCount = await GetUsersCountInRole(RoleName.Administrator);
            if (adminCount <= 1)
                return Error.Conflict(conflictMessage);
        }

        return await mutation();
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
            return Error.ResourceNotFound();

        var emailChanged = email is not null && email != user.Email;
        if (emailChanged && await UserWithEmailExists(email!))
            return Error.Conflict("Użytkownik o tym adresie e-mail już istnieje");

        user.EmailConfirmed = !emailChanged && user.EmailConfirmed;
        user.Email = email ?? user.Email;
        user.FirstName = firstName ?? user.FirstName;
        user.LastName = lastName ?? user.LastName;

        var identityResult = emailChanged
            ? await userManager.UpdateSecurityStampAsync(user)
            : await userManager.UpdateAsync(user);
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

        user.RefreshToken = HashToken(refreshToken);
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
            AccessTokenExpirationDate = accessToken?.ValidTo ?? clock.GetUtcNow().UtcDateTime,
            RefreshToken = refreshToken,
            RefreshTokenExpirationDate = refreshTokenExpiry.ToUniversalTime(),
        };
        return loginResponseDto;
    }

    private async Task SendRegistrationEmail(User user)
    {
        var resetCode = await userManager.GeneratePasswordResetTokenAsync(user);
        await emailSender.SendPasswordResetMessage(
            await CreateUserDto(user),
            WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(resetCode)),
            registration: true
        );
    }

    private async Task<string> CreateEmailConfirmationCode(User user)
    {
        var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

        return code;
    }

    private async Task<Result<JwtSecurityToken>> CreateAccessToken(User user)
    {
        var settings = jwtSettings.Value;
        var authenticationClaims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(SecurityStampHashClaim, HashToken(user.SecurityStamp!)),
        };

        var roles = await userManager.GetRolesAsync(user);
        authenticationClaims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Secret));
        var token = new JwtSecurityToken(
            issuer: settings.ValidIssuer,
            audience: settings.ValidAudience,
            expires: clock.GetUtcNow().UtcDateTime.AddSeconds(settings.AccessTokenLifetimeSeconds),
            claims: authenticationClaims,
            signingCredentials: new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256)
        );

        return token;
    }

    private (string token, DateTime expiry) CreateRefreshToken()
    {
        var expiry = clock
            .GetUtcNow()
            .UtcDateTime.AddSeconds(jwtSettings.Value.RefreshTokenLifetimeSeconds);
        var token = Convert.ToBase64String(randomGenerator.CreateSecureCodeBytes());

        return (token, expiry);
    }

    private static string HashToken(string token)
    {
        return Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
    }
}
