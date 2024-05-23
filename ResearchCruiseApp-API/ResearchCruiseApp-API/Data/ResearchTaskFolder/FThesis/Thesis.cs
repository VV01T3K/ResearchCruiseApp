using System.ComponentModel.DataAnnotations;
namespace  ResearchCruiseApp_API.Data.ResearchTaskFolder.FThesis;
public abstract class Thesis
{
  [MaxLength(20)] public string Author { get; set; }
  
  [MaxLength(20)] public string Title { get; set; }
  
  public string Type { get; set; }
}

