using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Data.ResearchTask.Project;

public interface IProject:IResearchTask
{
   [MaxLength(20)]
   public string Title { get; set; }
}