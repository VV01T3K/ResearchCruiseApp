namespace ResearchCruiseApp.Domain.Entities;

public class FormBUgUnit : Entity
{
    public FormB FormB { get; init; } = null!;

    public UgUnit UgUnit { get; init; } = null!;
    public string NoOfEmployees { get; init; } = null!;
    public string NoOfStudents { get; init; } = null!;
}
