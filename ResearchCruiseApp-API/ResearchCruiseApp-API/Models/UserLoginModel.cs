using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Models;

public class UserLoginModel
{
    [Required]
    public string Email { get; set; } = null!;
    
    [Required]
    public string Password { get; set; } = null!;
}