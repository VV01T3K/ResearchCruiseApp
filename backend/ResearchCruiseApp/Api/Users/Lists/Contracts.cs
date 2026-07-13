using ResearchCruiseApp.Infrastructure.Identity.Contracts;

namespace ResearchCruiseApp.Api.Users;

public sealed record UserResponse(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    IList<string> Roles,
    bool EmailConfirmed,
    bool Accepted
)
{
    public static UserResponse From(UserDto user)
    {
        return new UserResponse(
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

public sealed record CruiseManagerResponse(Guid Id, string Email, string FirstName, string LastName)
{
    public static CruiseManagerResponse From(CruiseManagerOptionDto user)
    {
        return new CruiseManagerResponse(user.Id, user.Email, user.FirstName, user.LastName);
    }
}
