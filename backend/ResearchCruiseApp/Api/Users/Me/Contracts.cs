using ResearchCruiseApp.Infrastructure.Identity.Contracts;

namespace ResearchCruiseApp.Api.Users;

public sealed record CurrentUserResponse(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    IList<string> Roles,
    bool EmailConfirmed,
    bool Accepted
)
{
    public static CurrentUserResponse From(UserDto user)
    {
        return new CurrentUserResponse(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Roles,
            user.EmailConfirmed,
            user.Accepted
        );
    }
}
