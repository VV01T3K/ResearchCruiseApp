namespace ResearchCruiseApp.Infrastructure.Identity;

internal sealed class JwtSettings
{
    public const string SectionName = "JWT";
    public string ValidIssuer { get; set; } = "";
    public string ValidAudience { get; set; } = "";
    public int AccessTokenLifetimeSeconds { get; set; }
    public int RefreshTokenLifetimeSeconds { get; set; }
    public string Secret { get; set; } = "";
}
