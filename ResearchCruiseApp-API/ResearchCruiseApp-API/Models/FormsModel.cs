using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Text.Json.Serialization;
using ResearchCruiseApp_API.Data.Interfaces;

namespace ResearchCruiseApp_API.Models;

public struct DateRange
{
    public DateRange()
    {
        
    }

    public int Beginning { get; set; } = 0;
    public int End { get; set; } = 0;

}

public class UGTeam
{
    public int UnitId { get; set; }
    public int? NoOfEmployees { get; set; }
    public int? NoOfStudents { get; set; }
}

public class GuestTeam
{

    public string? Institution { get; set; } = null!;
    public int? Count { get; set; }
}


public class ResearchTask
{
    //Zadania
    //typ zadania np licencjacka, magisterska
    public int Type { get; set; }
    public class Value
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Title { get; set; }
        
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Author { get; set; }
        
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Institution { get; set; }
        
        //TODO zmienić w frontendzie na DATETIME
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Date { get; set; }
        
        public class Time_type
        {
            public string? StartDate { get; set; } = null!;
            public string? EndDate { get; set; } = null!;
        }
        
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Time_type? Time { get; set; }
        
        //TODO zmienić w frontendzie na int
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? FinancingAmount { get; set; }
        
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Description { get; set; }
    }
    public Value Values { get; set; } 
}

public class EvaluatedResearchTask : ResearchTask, IEvaluatedField
{
    public int CalculatedPoints { get; set; }
    public EvaluatedResearchTask(ResearchTask task, int points)
    {
        this.Type = task.Type;
        this.Values = task.Values;
        this.CalculatedPoints = points;
    }

    public EvaluatedResearchTask()
    {
        
    }
}

public class Contract
{
    //Lista umów współpracy
    public string Category { get; set; }
    public string? Description { get; set; }
    public class InstitutionType
    {
        public string Localization { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
    }

    public InstitutionType? Institution { get; set; }
    public class ScanType
    {
        public string Name { get; set; }
        public string Content { get; set; }
    }

    public ScanType? Scan { get; set; }


}

public class EvaluatedContract : Contract, IEvaluatedField
{
    public int CalculatedPoints { get; set; }
    public EvaluatedContract(Contract contract, int points)
    {
        this.Category = contract.Category;
        this.Description = contract.Description;
        this.Institution = contract.Institution;
        this.Scan = contract.Scan;
        this.CalculatedPoints = points;
    }

    EvaluatedContract()
    {
        
    }
}

public class Publication
{
    //Publikacje
    public string Category { get; set; } = null!;
    public int? Year { get; set; } = 0;
    public int? Points { get; set; } = 0;
    public Info_type? Info { get; set; }
    public class Info_type
    {
        public string DOI { get; set; }
        public string Authors { get; set; }
        public string Title { get; set; }
        public string Magazine { get; set; }
    }
}

public class EvaluatedPublication : Publication, IEvaluatedField
{
    public int CalculatedPoints { get; set; }
    public EvaluatedPublication(Publication publication,  int points)
    {
        this.Category = publication.Category;
        this.Year = publication.Year;
        this.Points = publication.Points;
        this.Info = publication.Info;
        this.CalculatedPoints = points;
    }
    EvaluatedPublication()
    {
        
    }
}


public class Work
{
    //Prace
    public string Category { get; set; } = null!;
    public int? Year { get; set; } = 0;
    public Info_type? Info { get; set; }

    public class Info_type
    {
        public string Author { get; set; }
        public string Title { get; set; }
        public string? Promoter { get; set; }
    }
}

// public struct Efects
// {
//     public Efects()
//     {
//     }
//     
//     //typ zadania np licencjacka, magisterska
//     public string EfectTaskType { get; set; } = null!;
//     public string EfectTitle { get; set; } = null!;
//     public string EfectThesisAuthor { get; set; } = null!;
//     //(...)
// }

public class SPUBTask
{
    //Dlaczego data nie jest int ??? ??? ???
    public string YearFrom { get; set; } = null!;
    public string YearTo { get; set; } = null!;
    public string Name { get; set; } = null!;

}

public class EvaluatedSPUBTask : SPUBTask, IEvaluatedField
{
    public int CalculatedPoints { get; set; }

    public EvaluatedSPUBTask(SPUBTask spubTask,  int points)
    {
        this.YearFrom = spubTask.YearFrom;
        this.YearTo = spubTask.YearTo;
        this.Name = spubTask.Name;
        this.CalculatedPoints = points;
    }
    
    EvaluatedSPUBTask()
    {
        
    }
}

public class FormsModel
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
    public List<ResearchTask>? ResearchTasks { get; set; }

    
    //Lista umów
    public List<Contract>? Contracts { get; set; }
    
    
    // Zespoły z UG
    public List<UGTeam>? UgTeams { get; set; }
    
    
    //Zespoły goscinne
    public List<GuestTeam>? GuestTeams { get; set; }
    
    
    //Publikacje i Prace
    public List<Publication>? Publications { get; set; }
    public List<Work>? Works { get; set; }
    
    
    //Zadania SPUB
    public List<SPUBTask> SpubTasks { get; set; }
}