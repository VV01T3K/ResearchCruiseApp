using Microsoft.AspNetCore.Identity;

namespace ResearchCruiseApp_API.Data;

public class User : IdentityUser
{
    [ProtectedPersonalData]
    public string FirstName { get; set; } = null!;

    [ProtectedPersonalData]
    public string LastName { get; set; } = null!;

    public bool IsActive { get; set; } = true;
}