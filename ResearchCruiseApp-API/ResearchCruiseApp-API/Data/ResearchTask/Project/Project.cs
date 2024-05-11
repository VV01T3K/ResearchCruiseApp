using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Data.ResearchTask.Project;

public abstract class Project: ResearchTask
{
   [MaxLength(20)]
   public string Title { get; set; }
}