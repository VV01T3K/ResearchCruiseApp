using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Data;

public class SPUBTask
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    [StringLength(1024)]
    public string YearFrom { get; set; } = null!;
    
    [StringLength(1024)]
    public string YearTo { get; set; } = null!;
    
    [StringLength(1024)]
    public string Name { get; set; } = null!;
}