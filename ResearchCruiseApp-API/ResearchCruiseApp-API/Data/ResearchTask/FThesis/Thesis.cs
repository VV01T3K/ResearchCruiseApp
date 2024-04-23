using System.ComponentModel.DataAnnotations;
namespace  ResearchCruiseApp_API.Data.ResearchTask.FThesis;
public abstract class Thesis(int type, string author, string title): IResearchTask
{
  public int Type { get; set; } = type;
  [MaxLength(20)] public string Author { get; set; } = author;
  [MaxLength(20)] public string Title { get; set; } = title;
}