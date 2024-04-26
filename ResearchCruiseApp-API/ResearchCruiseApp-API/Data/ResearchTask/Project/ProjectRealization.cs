using System.Runtime.InteropServices.JavaScript;

namespace ResearchCruiseApp_API.Data.ResearchTask.Project;

public abstract class ProjectRealization(int type, string title, JSType.Date startDate, JSType.Date endDate, int financingAmount):IProjectRealization
{
    public int Type { get; set; } = type;
    public string Title { get; set; } = title;
    public JSType.Date StartDate { get; set; } = startDate;
    public JSType.Date EndDate { get; set; } = endDate;
    public int FinancingAmount { get; set; } = financingAmount;
}