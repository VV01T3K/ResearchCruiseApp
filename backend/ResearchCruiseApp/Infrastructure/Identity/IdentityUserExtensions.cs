using System.Collections.Immutable;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Infrastructure.Identity;

internal static class IdentityUserExtensions
{
    internal static readonly ImmutableArray<string> CruiseManagerRoleNames =
    [
        RoleName.Administrator,
        RoleName.Shipowner,
        RoleName.CruiseManager,
    ];

    public static async Task<UserDto?> GetUserDtoById(this UserManager<User> userManager, Guid id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        return user is null ? null : await userManager.CreateUserDto(user);
    }

    public static async Task<UserDto> CreateUserDto(this UserManager<User> userManager, User user)
    {
        var userDto = UserMappings.ToUserDto(user);
        userDto.Roles = await userManager.GetUserRolesNames(userDto.Id);

        return userDto;
    }

    public static async Task<IList<string>> GetUserRolesNames(
        this UserManager<User> userManager,
        Guid userId
    )
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return [];

        return await userManager.GetRolesAsync(user);
    }

    public static async Task<List<UserDto>> GetAllUsersDtos(
        this ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var users = await dbContext.Users.ToListAsync(cancellationToken);
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

    public static async Task<Dictionary<Guid, CruiseManagerOptionDto>> GetCruiseManagerOptionsByIds(
        this UserManager<User> userManager,
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

    public static async Task<bool> IsActiveWithAnyRole(
        this ApplicationDbContext dbContext,
        Guid id,
        IEnumerable<string> roleNames
    )
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

    public static async Task<Result<User>> CreateUserWithRoles(
        this UserManager<User> userManager,
        string email,
        string firstName,
        string lastName,
        string password,
        IReadOnlyCollection<string> roleNames
    )
    {
        var user = new User
        {
            UserName = email,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            Accepted = true,
            EmailConfirmed = true,
        };
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

    public static async Task<string> CreateEmailConfirmationCode(
        this UserManager<User> userManager,
        User user
    )
    {
        var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

        return code;
    }
}
