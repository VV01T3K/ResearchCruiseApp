using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Models;

public class UserRegistrationModel
{
    [Required]
    public string Email { get; set; } = null!;
    
    [Required]
    public string Password { get; set; } = null!;

    [Required]
    public string FirstName { get; set; } = null!;

    [Required]
    public string LastName { get; set; } = null!;
    
    public string? Role { get; set; } = null;
}