using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace ResearchCruiseApp.Infrastructure.Identity;

public class User : IdentityUser
{
    [ProtectedPersonalData]
    [StringLength(1024)]
    public string FirstName { get; set; } = null!;

    [ProtectedPersonalData]
    [StringLength(1024)]
    public string LastName { get; set; } = null!;

    public bool Accepted { get; set; }

    [StringLength(1024)]
    public string? RefreshToken { get; set; }

    public DateTime? RefreshTokenExpiry { get; set; }
}
