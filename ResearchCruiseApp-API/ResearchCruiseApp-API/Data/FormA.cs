using System.Runtime.InteropServices.JavaScript;
using NuGet.Protocol.Plugins;

namespace ResearchCruiseApp_API.Data;

public class FormA
{
    public int Id { get; set; }
    public User Manager { get; set; } = null!;
    public string OptimalPeriod { get; set; } = null!;
    public int CruiseHours { get; set; }
    public string AddnotationsToPeriod { get; set; } = null!;
    public string Usage { get; set; } = null!;
    public string Permission { get; set; } = null!;
    public string Region { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Objective { get; set; } = null!;
    public int NumberOfEmployes { get; set; }
    public int NumberOfStudents { get; set; }
    public int NumberOfGuests { get; set; }
    public string OrganizationalUnit { get; set; } = null!;
    public List<Contract> Contracts { get; set; } = null!;
    public List<TaskToDo> TasksToDo { get; set; } = null!;
    public List<SPUBTask> SPUBTasks { get; set; } = null!;
    
}