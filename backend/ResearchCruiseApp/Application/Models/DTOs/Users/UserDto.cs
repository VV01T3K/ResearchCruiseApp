namespace ResearchCruiseApp.Application.Models.DTOs.Users;

public class UserDto
{
    public Guid Id { get; set; }

    public string UserName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public IList<string> Roles { get; set; } = null!;

    public bool EmailConfirmed { get; set; }

    public bool Accepted { get; set; }
}
