using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Data;

public class GuestTeam
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public string Institution { get; set; }
    
    public int Count { get; set; }
}