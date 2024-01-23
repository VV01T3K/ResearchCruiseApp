namespace ResearchCruiseApp_API.Models;

public class FormsModel
{
    //TODO sprawdzić czy model może mieć struktury i każdą sekcje umieścić w strukturze
    public string Id { get; set; } = null!;
    public string CruiseManager { get; set; } = null!;
    public string Deputy { get; set; } = null!;
    //(?) jaki format na rok
    public string Year { get; set; } = null!;
    
    
    //Dopuszczlny termin rejsu (typ?)
    public string PermissibleDate { get; set; } = null!;
    //Optymalny termin rejsu (typ?)
    public string OptimalDate { get; set; } = null!;
    public int CruiseHours { get; set; } = 0;
    //Uwaga dotycząca terminu:
    public string DateComment { get; set; } = null!;
    //Czy statek na potrzeby badań będzie wykorzystywany
    public string Choice1 { get; set; } = null!;
    
    
    //Czy do badań prowadzonych podczas rejsu są potrzebne dodatkowe pozwolenia?:
    public string Permissions { get; set; } = null!;
    
    
    //(?) opcjonalnie opis. 
    public string ResearchArea { get; set; } = null!;
    public string ResearchAreaComment { get; set; } = null!;
    
    
    //Cel rejsu (opis max. 100 słów):
    public string Choice2 { get; set; } = null!;
    public string CruiseObectiveComment { get; set; } = null!;
    
    
    //Przewidywana liczba osób zamierzających uczestniczyć w rejsie, podać liczby osobno dla:
    public int UGWorkers { get; set; } = 0;
    public int Students { get; set; } = 0;
    public int Guests { get; set; } = 0;
    
    //Zadania
    //typ zadania np licencjacka, magisterska
    public string TaskType { get; set; } = null!;
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
    
    
    //Lista umów współpracy
    //
    //
    
    
    //Zespoły badawcze
    public string ResearchersOutsideUG { get; set; } = null!;
    public string ResearchersOutsideWOIG { get; set; } = null!;
    public string ResearchersFromWOIG { get; set; } = null!;
    
    
    //Publikacje i Prace
    //Publikacje
    public string PublicationCategory { get; set; } = null!;
    public string PublicationDOI { get; set; } = null!;
    public string PublicationAuthor { get; set; } = null!;
    public string PublicationTitle { get; set; } = null!;
    public string PublicationMagazine { get; set; } = null!;
    public string PublicationRelease { get; set; } = null!;
    public int PublicationPoints { get; set; } = 0;
    public string PublicationActions { get; set; } = null!;
    //Prace
    public string WorkCategory { get; set; } = null!;
    public string WorkAuthor { get; set; } = null!;
    public string WorkTitle { get; set; } = null!;
    public string WorkPromotor { get; set; } = null!;
    public string WorkDefenseYear { get; set; } = null!;
    public string WorkActions { get; set; } = null!;
    
    
    //Efekty rejsu (TODO ujednolicić nieścisłośći pomiedzy polami do wpisywania a zawartosciami tabeli)
    //typ zadania np licencjacka, magisterska
    public string EfectTaskType { get; set; } = null!;
    public string EfectTitle { get; set; } = null!;
    public string EfectThesisAuthor { get; set; } = null!;
    //(...)
    
    
    //Zadanie SPUB
    public string ResearchTask { get; set; } = null!;
}