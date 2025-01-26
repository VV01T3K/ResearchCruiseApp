namespace ResearchCruiseApp.Application.Models.DTOs.Account;

public class LoginResponseDto
{
    public string AccessToken { get; set; } = null!;

    public DateTime ExpiresIn { get; set; }
    public string RefreshToken { get; set; } = null!;
    public DateTime ExpirationDate { get; set; }
}
