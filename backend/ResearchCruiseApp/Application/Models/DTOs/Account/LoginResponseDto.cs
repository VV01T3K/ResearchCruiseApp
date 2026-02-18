namespace ResearchCruiseApp.Application.Models.DTOs.Account;

public class LoginResponseDto
{
    public string AccessToken { get; set; } = null!;

    public DateTime AccessTokenExpiration { get; set; }
    public string RefreshToken { get; set; } = null!;
    public DateTime RefreshTokenExpiration { get; set; }
}
