using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Domain.Entities;


public class SpubTask
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public int YearFrom { get; set; }
    
    public int YearTo { get; set; }
    
    [StringLength(1024)]
    public string Name { get; set; } = null!;
}