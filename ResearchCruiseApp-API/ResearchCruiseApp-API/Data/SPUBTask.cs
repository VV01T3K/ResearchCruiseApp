using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Data;

public class SPUBTask
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public string Name { get; set; }
    
    public string YearFrom { get; set; }
    
    public string YearTo { get; set; }
    
    //public List<FormA> Forms { get; set; } = null!;
}