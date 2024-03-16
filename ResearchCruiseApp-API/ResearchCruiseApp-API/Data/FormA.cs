using System.Runtime.InteropServices.JavaScript;
using NuGet.Protocol.Plugins;

namespace ResearchCruiseApp_API.Data;


public class DateRange
{
    public int Beg;
    public int End;
}

public class FormA
{
    public int Id { get; set; }
    public User CruiseManager { get; set; } = null!;  //User
    public User Deputy { get; set; } = null!; //User
    public string Year { get; set; } = null!;
    public DateRange PermissibleDate { get; set; } = null!;
    public DateRange OptimalDate { get; set; } = null!;
    public int CruiseHours { get; set; }
    public string DateComment { get; set; } = null!;
    public string ShipUsage { get; set; } = null!;
    public string Permissions { get; set; } = null!;
    public string ResearchArea { get; set; } = null!;
    public string CruiseGoal { get; set; } = null!;
    public int UGWorkers { get; set; }
    public int Students { get; set; }
    public int Guests { get; set; }
    public string OrganizationalUnit { get; set; } = null!;
    public List<Contract> ContractsList { get; set; } = null!;
    public List<TaskToDo> ResearchTask { get; set; } = null!;
    public List<SPUBTask> SPUBTasks { get; set; } = null!;
    
}