using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Domain.Entities;


public class UgTeam
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public Guid UnitId { get; set; }
    
    public string NoOfEmployees { get; set; }
    
    public string NoOfStudents { get; set; }
}