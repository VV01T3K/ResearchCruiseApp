namespace ResearchCruiseApp.Application.Models.DTOs.Account;

public class RefreshDto
{
    public string AccessToken { get; set; } = null!;

    public string RefreshToken { get; init; } = null!;
}
