namespace ResearchCruiseApp.Api.Users;

public sealed record ChangePasswordRequest(string Password, string NewPassword);
