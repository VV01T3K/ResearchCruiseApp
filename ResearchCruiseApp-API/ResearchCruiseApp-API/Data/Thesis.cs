using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Data;

public class Thesis
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public string Category { get; set; }
    
    public int Year { get; set; }
    
    //File_type
    public string Author { get; set; }
    
    public string Title { get; set; }
    
    public string Promoter { get; set; }
}