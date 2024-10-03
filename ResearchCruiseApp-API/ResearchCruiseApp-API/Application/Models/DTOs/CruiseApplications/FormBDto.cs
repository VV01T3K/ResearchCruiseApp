using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


// TODO Check how form C looks like and fill all the fields
public class FormBDto
{
    //Ogólne informacje
    //public CruiseInfo CruiseInfoData { get; set; }
    
    [RegularExpression(@"^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$")]
    public Guid? Id { get; set; } = null!;
    //\p{L}\p{M}
    public Guid? CruiseManagerId { get; set; } = null!;
    public Guid? DeputyManagerId { get; set; } = null!;
    
    //(?) jaki format na rok
    [Range(2024, 2050)]
    public int? Year { get; set; } = 0;
    
    //Dopuszczlny termin rejsu (typ?)
    //[Length(2,2)]
    //[Range(0,24)]
    public HashSet<int>? AcceptablePeriod { get; set; } = null!;
    
    //Optymalny termin rejsu (typ?)
    //[Length(2,2)]
    //[Range(0,24)]
    public HashSet<int>? OptimalPeriod { get; set; } = null!;
    
    [Range(1,99)]
    public int? CruiseHours { get; set; } = 0;
    
    //Uwaga dotycząca terminu:
    [StringLength(200)]
    public string? PeriodNotes { get; set; } = null!;
    //Czy statek na potrzeby badań będzie wykorzystywany
    [Range(0,4)]
    public int? ShipUsage { get; set; } = 0;
    
    //koniec CruiseInfo


    //Czy do badań prowadzonych podczas rejsu są potrzebne dodatkowe pozwolenia?:
    public int? PermissionsRequired { get; set; }
    
    [MaxLength(200)]
    public string? Permissions { get; set; }
    
    
    //(?) opcjonalnie opis. 
    [Range(0,20)]
    public int? ResearchArea { get; set; }
    
    
    //Cel rejsu (opis max. 100 słów):
    public int? CruiseGoal { get; set; }
    
    [MaxLength(200)]
    public string? CruiseGoalDescription { get; set; }

    
    //Zadania
    public List<ResearchTaskDto>? ResearchTasks { get; set; }

    
    //Lista umów
    public List<ContractDto>? Contracts { get; set; }
    
    
    // Zespoły z UG
    public List<UgTeamDto>? UgTeams { get; set; }
    
    
    //Zespoły goscinne
    public List<GuestUnitDto>? GuestTeams { get; set; }
    
    
    //Publikacje i Prace
    public List<PublicationDto>? Publications { get; set; }
    
    
    //Zadania SPUB
    public List<SpubTaskDto> SpubTasks { get; set; } = [];
}