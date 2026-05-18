namespace ResearchCruiseApp.Api.Account.Contracts;

public class RefreshDto
{
    public string AccessToken { get; set; } = null!;

    public string RefreshToken { get; init; } = null!;
}
