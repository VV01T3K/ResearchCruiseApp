namespace ResearchCruiseApp.Domain.Entities;

public class FormAUgUnit : Entity
{
    public FormA FormA { get; init; } = null!;

    public UgUnit UgUnit { get; init; } = null!;
    public string NoOfEmployees { get; init; } = null!;
    public string NoOfStudents { get; init; } = null!;
}
