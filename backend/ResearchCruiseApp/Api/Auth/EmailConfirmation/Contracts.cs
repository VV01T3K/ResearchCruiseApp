namespace ResearchCruiseApp.Api.Auth;

public sealed record ConfirmEmailRequest(Guid UserId, string Code);

public sealed record ResendConfirmationEmailRequest(string Email);
