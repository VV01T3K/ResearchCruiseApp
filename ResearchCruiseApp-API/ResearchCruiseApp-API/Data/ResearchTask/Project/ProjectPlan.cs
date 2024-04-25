using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices.JavaScript;

namespace ResearchCruiseApp_API.Data.ResearchTask.Project;

public class ProjectPlan(int type, string title, string institution, JSType.Date date):IProject
{
    public int Type { get; set; } = type;
    public string Title { get; set; } = title;
    [MaxLength(20)]
    public string Insitution { get; set; } = institution;
    public JSType.Date Date { get; set; } = date;

}