namespace ResearchCruiseApp.Application.Models.DTOs.Account;

public class LoginResponseDto
{
    public string AccessToken { get; set; } = null!;

    public DateTime AccessTokenExpirationDate { get; set; }
    public string RefreshToken { get; set; } = null!;
    public DateTime RefreshTokenExpirationDate { get; set; }
}
