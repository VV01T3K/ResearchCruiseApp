using Microsoft.AspNetCore.Mvc;

namespace ResearchCruiseApp.Api.Auth;

public sealed record ConfirmEmailRequest(
    [property: FromQuery(Name = "userId")] Guid UserId,
    [property: FromQuery(Name = "code")] string Code
);

public sealed record ResendConfirmationEmailRequest(string Email);
