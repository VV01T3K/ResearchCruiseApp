using System.Runtime.InteropServices.JavaScript;

namespace ResearchCruiseApp_API.Data.ResearchTask.Project;

public interface IProjectRealization:IProject
{
    public JSType.Date StartDate { get; set; }
    public JSType.Date EndDate { get; set; }
    public int FinancingAmount { get; set; }
}