using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Data;

public class UGTeam
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public int Unit { get; set; }
    
    public int NoOfEmployees { get; set; }
    
    public int NoOfStudents { get; set; }
}