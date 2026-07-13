namespace ResearchCruiseApp.Api.Auth;

public sealed record RequestPasswordResetRequest(string Email);

public sealed record ResetPasswordRequest(
    string EmailBase64,
    string ResetCode,
    string Password,
    string PasswordConfirm
);
