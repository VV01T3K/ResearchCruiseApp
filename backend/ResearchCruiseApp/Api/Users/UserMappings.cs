using ResearchCruiseApp.Api.Users.Contracts;
using ResearchCruiseApp.Infrastructure.Identity;

namespace ResearchCruiseApp.Api.Users;

internal static class UserMappings
{
    public static UserDto ToUserDto(User user) =>
        new()
        {
            Id = Guid.Parse(user.Id),
            UserName = user.UserName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            EmailConfirmed = user.EmailConfirmed,
            Accepted = user.Accepted,
        };

    public static CruiseManagerOptionDto ToCruiseManagerOptionDto(User user) =>
        new()
        {
            Id = Guid.Parse(user.Id),
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
        };
}
