using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Data.ResearchTaskFolder.Project;

public abstract class Project
{
   [MaxLength(20)]
   public string Title { get; set; }
}