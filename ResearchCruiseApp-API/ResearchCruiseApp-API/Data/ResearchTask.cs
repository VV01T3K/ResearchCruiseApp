using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace  ResearchCruiseApp_API.Data;
public class ResearchTask
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public int Type { get; set; }

    [StringLength(1024)]
    public string? Title { get; set; }
    
    [StringLength(1024)]
    public string? Author { get; set; }
    
    [StringLength(1024)]
    public string? Institution { get; set; }

    [StringLength(1024)]
    public string? Date { get; set; }
    
    [StringLength(1024)]
    public string? StartDate { get; set; }
    
    [StringLength(1024)]
    public string? EndDate { get; set; }
    
    public double? FinancingAmount { get; set; }
    
    [StringLength(1024)]
    public string? Description { get; set; }
}