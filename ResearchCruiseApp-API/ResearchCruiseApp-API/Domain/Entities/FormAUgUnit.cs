using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Domain.Entities;


public class FormAUgUnit : Entity
{
    public FormA FormA { get; init; } = null!;

    public UgUnit UgUnit { get; init; } = null!;
    
    public int NoOfEmployees { get; init; }
    
    public int NoOfStudents { get; init; }
}