using System.Text;
using Microsoft.Extensions.Options;

namespace ResearchCruiseApp.Infrastructure.Identity;

internal sealed class JwtSettingsValidator : IValidateOptions<JwtSettings>
{
    private const int MinimumHs256KeyBytes = 32;

    public ValidateOptionsResult Validate(string? name, JwtSettings options)
    {
        List<string> failures = [];
        if (string.IsNullOrWhiteSpace(options.ValidIssuer))
            failures.Add("JWT:ValidIssuer is required.");
        if (string.IsNullOrWhiteSpace(options.ValidAudience))
            failures.Add("JWT:ValidAudience is required.");
        if (options.AccessTokenLifetimeSeconds <= 0)
            failures.Add("JWT:AccessTokenLifetimeSeconds must be positive.");
        if (options.RefreshTokenLifetimeSeconds <= 0)
            failures.Add("JWT:RefreshTokenLifetimeSeconds must be positive.");
        if (Encoding.UTF8.GetByteCount(options.Secret) < MinimumHs256KeyBytes)
            failures.Add($"JWT:Secret must be at least {MinimumHs256KeyBytes} bytes long.");

        return failures.Count == 0
            ? ValidateOptionsResult.Success
            : ValidateOptionsResult.Fail(failures);
    }
}
