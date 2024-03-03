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
    public string Id { get; set; } = null!;
    public string CruiseManager { get; set; } = null!;
    public string Deputy { get; set; } = null!;
    //(?) jaki format na rok
    public string Year { get; set; } = null!;
    
    
    //Dopuszczlny termin rejsu (typ?)
    public DateRange PermissibleDate;
    //Optymalny termin rejsu (typ?)
    public DateRange OptimalDate;
    public int CruiseHours { get; set; } = 0;
    //Uwaga dotycząca terminu:
    public string DateComment { get; set; } = null!;
    //Czy statek na potrzeby badań będzie wykorzystywany
    public string Choice { get; set; } = null!;
}

public struct Tasks
{
    public Tasks()
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

public struct Contracts
{
    //Lista umów współpracy
    //
    //
}

public struct Publications
{
    public Publications()
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

public struct Theses
{
    public Theses()
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
    public CruiseInfo CruiseInfoData;
    
    
    //Czy do badań prowadzonych podczas rejsu są potrzebne dodatkowe pozwolenia?:
    public string Permissions { get; set; } = null!;
    
    
    //(?) opcjonalnie opis. 
    public string ResearchArea { get; set; } = null!;
    
    
    //Cel rejsu (opis max. 100 słów):
    public string ChoiceGoal { get; set; } = null!;
    
    
    //Przewidywana liczba osób zamierzających uczestniczyć w rejsie, podać liczby osobno dla:
    public int UGWorkers { get; set; } = 0;
    public int Students { get; set; } = 0;
    public int Guests { get; set; } = 0;

    
    //Zadania
    public List<Tasks>? TasksList;

    
    //Lista umów
    public List<Contracts>? ContractsList;
    
    
    //Zespoły badawcze
    public string ResearchersOutsideUG { get; set; } = null!;
    public string ResearchersOutsideWOIG { get; set; } = null!;
    public int ResearchersFromWOIG { get; set; } = 0;
    
    
    //Publikacje i Prace
    public List<Publications>? PublicationsList;
    public List<Theses>? ThesesList;
    
    
    //Efekty rejsu 
    public List<Efects>? EfectsList;
    
    
    //Zadanie SPUB
    public string ResearchTask { get; set; } = null!;
}