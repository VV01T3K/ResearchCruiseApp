using Microsoft.AspNetCore.Identity;

namespace ResearchCruiseApp_API.Models;

public class User : IdentityUser
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
}