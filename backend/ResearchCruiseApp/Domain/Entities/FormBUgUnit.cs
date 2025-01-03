using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Domain.Entities;

public class FormBUgUnit : Entity
{
    public FormB FormB { get; init; } = null!;

    public UgUnit UgUnit { get; init; } = null!;

    [StringLength(1024)]
    public string NoOfEmployees { get; init; } = null!;

    [StringLength(1024)]
    public string NoOfStudents { get; init; } = null!;
}
