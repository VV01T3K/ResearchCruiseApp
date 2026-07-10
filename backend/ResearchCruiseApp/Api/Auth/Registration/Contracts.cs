namespace ResearchCruiseApp.Api.Auth;

public sealed record RegisterAccountRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName
);
