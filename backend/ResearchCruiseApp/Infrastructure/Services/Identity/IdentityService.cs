using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NeoSmart.Utils;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Account;
using ResearchCruiseApp.Application.Models.DTOs.Users;

namespace ResearchCruiseApp.Infrastructure.Services.Identity;

public class IdentityService(
    UserManager<User> userManager,
    RoleManager<IdentityRole> roleManager,
    IEmailSender emailSender,
    IRandomGenerator randomGenerator,
    ICurrentUserService currentUserService,
    IMapper mapper,
    IConfiguration configuration
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

    public async Task<Result> ConfirmEmail(Guid userId, string code, string? changedEmail)
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

        IdentityResult result;

        if (string.IsNullOrEmpty(changedEmail))
            result = await userManager.ConfirmEmailAsync(user, code);
        else
        {
            result = await userManager.ChangeEmailAsync(user, changedEmail, code);

            if (result.Succeeded)
                result = await userManager.SetUserNameAsync(user, changedEmail); // Email is also the username
        }

        return result.Succeeded ? Result.Empty : Error.UnknownIdentity();
    }

    public async Task<Result> RegisterUser(RegisterFormDto registerForm, string roleName)
    {
        var emailAddressAttribute = new EmailAddressAttribute();

        if (!userManager.SupportsUserEmail)
            return Error.ServiceUnavailable();

        if (
            string.IsNullOrEmpty(registerForm.Email)
            || !emailAddressAttribute.IsValid(registerForm.Email)
        )
            return Error.InvalidArgument("E-mail jest niepoprawny");

        var user = CreateUser(registerForm);
        var identityResult = await userManager.CreateAsync(user, registerForm.Password);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult();

        identityResult = await userManager.AddToRoleAsync(user, roleName);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult();

        var emailConfirmationCode = await CreateEmailConfirmationCode(user, false);
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

        var emailConfirmationCode = await CreateEmailConfirmationCode(user, false);
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
            return Error.UnknownIdentity();

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

    public async Task<Result> AddUserWithRole(
        AddUserFormDto addUserFormDto,
        string password,
        string roleName
    )
    {
        var user = CreateUser(addUserFormDto);
        var identityResult = await userManager.CreateAsync(user, password);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult();

        identityResult = await userManager.AddToRoleAsync(user, roleName);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult();

        var userDto = await CreateUserDto(user);
        await emailSender.SendAccountCreatedMessage(userDto, roleName, password);

        return Result.Empty;
    }

    public async Task<Result> AddRoleToUser(Guid userId, string roleName)
    {
        var user = await userManager.FindByEmailAsync(userId.ToString());
        if (user is null)
            return Error.ResourceNotFound();

        var result = await userManager.AddToRoleAsync(user, roleName);
        return result.ToApplicationResult();
    }

    public async Task<Result> RemoveRoleFromUser(Guid userId, string roleName)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ResourceNotFound();

        var result = await userManager.RemoveFromRoleAsync(user, roleName);
        return result.ToApplicationResult();
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

    public async Task<Result> DeleteUser(Guid userId)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ForbiddenOperation();

        var identityResult = await userManager.DeleteAsync(user);

        return identityResult.Succeeded ? Result.Empty : identityResult.ToApplicationResult();
    }

    public async Task<Result> UpdateUser(Guid userId, UpdateUserFormDto updateUserFormDto)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ForbiddenOperation();

        user.Email = updateUserFormDto.Email ?? user.Email;
        user.EmailConfirmed = updateUserFormDto.Email is null && user.EmailConfirmed;
        user.FirstName = updateUserFormDto.FirstName ?? user.FirstName;
        user.LastName = updateUserFormDto.LastName ?? user.LastName;

        var identityResult = await userManager.UpdateAsync(user);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult();

        var userRoles = await userManager.GetRolesAsync(user);

        if (updateUserFormDto.Role is not null)
        {
            identityResult = await userManager.RemoveFromRolesAsync(user, userRoles);
            if (!identityResult.Succeeded)
                return identityResult.ToApplicationResult();
            identityResult = await userManager.AddToRoleAsync(user, updateUserFormDto.Role);
            if (!identityResult.Succeeded)
                return identityResult.ToApplicationResult();
        }

        if (user is { EmailConfirmed: false, Email: not null })
        {
            await ResendEmailConfirmationEmail(
                user.Email,
                updateUserFormDto.Role ?? userRoles.First()
            );
        }

        return Result.Empty;
    }

    private static User CreateUser(RegisterFormDto registerFormDto) =>
        CreateUser(
            registerFormDto.Email,
            registerFormDto.FirstName,
            registerFormDto.LastName,
            false
        );

    private static User CreateUser(AddUserFormDto addUserFormDto) =>
        CreateUser(
            addUserFormDto.Email,
            addUserFormDto.FirstName,
            addUserFormDto.LastName,
            true,
            true
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
        var userDto = mapper.Map<UserDto>(user);
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
            ExpiresIn = accessToken?.ValidTo ?? DateTime.UtcNow,
            RefreshToken = refreshToken,
            ExpirationDate = refreshTokenExpiry.ToUniversalTime(),
        };
        return loginResponseDto;
    }

    private async Task<string> CreateEmailConfirmationCode(User user, bool changeEmail)
    {
        var code = changeEmail
            ? await userManager.GenerateChangeEmailTokenAsync(user, user.Email!)
            : await userManager.GenerateEmailConfirmationTokenAsync(user);
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
