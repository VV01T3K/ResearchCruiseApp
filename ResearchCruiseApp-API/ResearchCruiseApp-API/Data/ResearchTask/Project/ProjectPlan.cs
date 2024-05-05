using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices.JavaScript;

namespace ResearchCruiseApp_API.Data.ResearchTask.Project;

public class ProjectPlan: Project
{
    public int Type { get; set; }
    
    [MaxLength(20)]
    public string Insitution { get; set; }
    
    public JSType.Date Date { get; set; }

}