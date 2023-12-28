using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Models;

public class UserRegisterModel
{
    [Required]
    public string UserName { get; set; } = null!;
    
    [Required]
    public string Email { get; set; } = null!;
    
    [Required]
    public string Password { get; set; } = null!;
    
    public string? Role { get; set; } = null;
}