using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Data;

public class Publication
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public string Category { get; set; }
    
    public int Year { get; set; }
    
    public int Points { get; set; }
    
    //Info_type
    public string DOI { get; set; }
    
    public string Authors { get; set; }
    
    public string Title { get; set; }
    
    public string Magazine { get; set; }
}