using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Domain.Entities;


public class SpubTask
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public string YearFrom { get; set; }
    
    public string YearTo { get; set; }
    
    [StringLength(1024)]
    public string Name { get; set; } = null!;
}