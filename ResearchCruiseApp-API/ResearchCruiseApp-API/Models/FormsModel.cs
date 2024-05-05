using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Models;



public struct DateRange
{
    public DateRange()
    {
        
    }

    public int Beginning { get; set; } = 0;
    public int End { get; set; } = 0;

}

public struct CruiseInfo
{
    public CruiseInfo()
    {
    }
    //podstawowe informacje
    [RegularExpression(@"^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$")]
    public Guid? Id { get; set; } = null!;
    //\p{L}\p{M}
    public Guid? CruiseManagerId { get; set; } = null!;
    public Guid? DeputyManagerId { get; set; } = null!;
    
    //(?) jaki format na rok
    [Range(2024, 2050)]
    public int Year { get; set; } = 0;
    
    //Dopuszczlny termin rejsu (typ?)
    //[Length(2,2)]
    //[Range(0,24)]
    public HashSet<int>? AcceptablePeriod { get; set; } = null!;
    
    
    
    //Optymalny termin rejsu (typ?)
    //[Length(2,2)]
    //[Range(0,24)]
    public HashSet<int>? OptimalPeriod { get; set; } = null!;
    
    [Range(1,99)]
    public int CruiseHours { get; set; } = 0;
    
    //Uwaga dotycząca terminu:
    [StringLength(200)]
    public string? PeriodNotes { get; set; } = null!;
    //Czy statek na potrzeby badań będzie wykorzystywany
    [Range(0,4)]
    public int ShipUsage { get; set; } = 0;
}

public struct ResearchTask
{
    public ResearchTask()
    {
    }

    //Zadania
    //typ zadania np licencjacka, magisterska
    public string Type { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string ThesisAuthor { get; set; } = null!;
    //Instytucja do której projetk będzie składany
    public string ProjectInstitution { get; set; } = null!;
    //przewidywany termin skadania projektu
    //Proponowany termin złożenia
    public string ProjectDeadline { get; set; } = null!;
    //Ramy czasowe
    public string ProjectTime { get; set; } = null!;
    //Kwota przyznanego dla UG finansowania
    public float ProjectFunding { get; set; } = 0;
    //Opis zajec dydaktycznych
    public string Description { get; set; } = null!;
    //Proponowane czasopismo
    public string MagazineName { get; set; } = null!;
    //liczba punktów ministerialnych
    public int MinisterialPoints { get; set; } = 0;
}

public struct Contract
{
    //Lista umów współpracy
    //
    //
}

public struct Publication
{
    public Publication()
    {
    }

    //Publikacje
    public string Category { get; set; } = null!;
    public string DOI { get; set; } = null!;
    public string Author { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Magazine { get; set; } = null!;
    public string Release { get; set; } = null!;
    public int Points { get; set; } = 0;
    public string Actions { get; set; } = null!;
}

public struct Thesis
{
    public Thesis()
    {
    }

    //Prace
    public string Category { get; set; } = null!;
    public string Author { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Promotor { get; set; } = null!;
    public string DefenseYear { get; set; } = null!;
    public string Actions { get; set; } = null!;
}

public struct Efects
{
    public Efects()
    {
    }
    //TODO ujednolicić nieścisłośći pomiedzy polami do wpisywania a zawartosciami tabeli)
    //typ zadania np licencjacka, magisterska
    public string EfectTaskType { get; set; } = null!;
    public string EfectTitle { get; set; } = null!;
    public string EfectThesisAuthor { get; set; } = null!;
    //(...)
}

public class FormsModel
{
    //Ogólne informacje
    public CruiseInfo CruiseInfoData { get; set; }


    //Czy do badań prowadzonych podczas rejsu są potrzebne dodatkowe pozwolenia?:
    public bool? PermissionsRequired { get; set; }
    
    [MaxLength(200)]
    public string? Permissions { get; set; }
    
    
    //(?) opcjonalnie opis. 
    [Range(0,20)]
    public int? ResearchArea { get; set; }
    
    
    //Cel rejsu (opis max. 100 słów):
    public int? CruiseGoalType { get; set; }
    
    [MaxLength(200)]
    public string? CruiseGoalDescription { get; set; }
    
    
    //Przewidywana liczba osób zamierzających uczestniczyć w rejsie, podać liczby osobno dla:
    public int? UGWorkers { get; set; }
    public int? Students { get; set; }
    public int? Guests { get; set; }

    
    //Zadania
    public List<ResearchTask>? ResearchTasks;

    
    //Lista umów
    public List<Contract>? Contracts;
    
    
    //Zespoły badawcze
    public string? ResearchersOutsideUG { get; set; }
    public string? ResearchersOutsideWOIG { get; set; }
    public int? ResearchersFromWOIG { get; set; }
    
    
    //Publikacje i Prace
    public List<Publication>? Publications;
    public List<Thesis>? Theses;
    
    
    //Efekty rejsu (do usunięcia?)
    public List<Efects>? EfectsList;
    
    
    //Zadanie SPUB
    public string? ResearchTask { get; set; }
}