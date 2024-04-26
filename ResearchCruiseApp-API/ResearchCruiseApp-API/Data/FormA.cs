using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices.JavaScript;
using NuGet.Protocol.Plugins;
using ResearchCruiseApp_API.Data.ResearchTask;
using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Data;


public class FormA
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public User CruiseManager { get; set; }  //User
    public User Deputy { get; set; } //User
    [Range(2024, 2050)]
    public int Year { get; set; }
    [Length(2,2)]
    [Range(0,24)]
    public HashSet<int> PermissibleDate { get; set; }
    [Length(2,2)]
    [Range(0,24)]
    public HashSet<int> OptimalDate { get; set; }
    [Range(1,99)]
    public int CruiseHours { get; set; }
    [StringLength(200)]
    public string DateComment { get; set; }
    [Range(0,4)]
    public int ShipUsage { get; set; }
    
    private bool _addtionalPermissionsRequired;
    public bool AddtionalPermissionsRequired
    {
        get{return _addtionalPermissionsRequired;}
        set
        {
            _addtionalPermissionsRequired = value;
            if (!value)
            {
                AdditionalPermissions = null;
            }
        }
    }
    [MaxLength(200)]
    public string? AdditionalPermissions { get; set; }
    /* TODO Zdobyć wymagania co do obszaru */
    [Range(0,20)]
    public int ResearchArea { get; set; } 
    [MaxLength(200)]
    public string CruiseGoal { get; set; }
    public List<IResearchTask> ResearchTasks { get; set; } 
    public List<Contract>  Contracts { get; set; } 
    
    // public string OrganizationalUnit { get; set; } ;
    // public List<Contract> ContractsList { get; set; } ;

    // public List<SPUBTask> SPUBTasks { get; set; } ;
    public FormA()
    {
        // Domyślnie właściwości CruiseManager i Deputy będą miały wartość null
        // Nie musisz nic tutaj inicjalizować, jeśli chcesz, żeby były niezainicjowane.
    }

}