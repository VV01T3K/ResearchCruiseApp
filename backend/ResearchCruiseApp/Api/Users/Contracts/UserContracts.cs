namespace ResearchCruiseApp.Api.Users.Contracts;

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

public class CruiseManagerOptionDto
{
    public Guid Id { get; set; }

    public string Email { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;
}

public class AddUserFormDto
{
    public required string Email { get; init; }

    public required string FirstName { get; init; }

    public required string LastName { get; init; }

    public string? Role { get; init; }
}

public class UpdateUserFormDto
{
    public string? Email { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? Role { get; init; }
}
