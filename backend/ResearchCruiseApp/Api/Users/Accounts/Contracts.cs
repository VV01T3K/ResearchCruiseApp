namespace ResearchCruiseApp.Api.Users;

public sealed record CreateUserRequest(
    string Email,
    string FirstName,
    string LastName,
    IReadOnlyList<string> Roles
);

public sealed record UpdateUserRequest(
    string? Email = null,
    string? FirstName = null,
    string? LastName = null
);
