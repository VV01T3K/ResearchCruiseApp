namespace ResearchCruiseApp.Api.Account;

public sealed record ChangePasswordRequest(string Password, string NewPassword);
