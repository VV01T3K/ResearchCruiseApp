using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Domain.Entities;


public class Publication
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [StringLength(1024)]
    public string Category { get; set; } = null!;
    
    [StringLength(1024)]
    public string Doi { get; set; } = null!;
    
    [StringLength(1024)]
    public string Authors { get; set; } = null!;
    
    [StringLength(1024)]
    public string Title { get; set; } = null!;
    
    [StringLength(1024)]
    public string Magazine { get; set; } = null!;
    
    public int Year { get; set; }

    public int MinisterialPoints { get; set; }
}