using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Data;

public class Thesis
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    [StringLength(1024)]
    public string Category { get; set; } = null!;
    
    [StringLength(1024)]
    public string Author { get; set; } = null!;
    
    [StringLength(1024)]
    public string Title { get; set; } = null!;
    
    [StringLength(1024)]
    public string Promoter { get; set; } = null!;
    
    public int Year { get; set; }
}