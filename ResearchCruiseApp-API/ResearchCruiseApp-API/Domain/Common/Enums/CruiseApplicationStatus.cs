using ResearchCruiseApp_API.Domain.Common.Attributes;

namespace ResearchCruiseApp_API.Domain.Common.Enums;


public enum CruiseApplicationStatus
{
    [StringValue("Oczekujące na przełożonego")]
    WaitingForSupervisor,
    
    [StringValue("Zaakceptowane przez przełożonego")]
    AcceptedBySupervisor,
    
    [StringValue("Odrzucone przez przełożonego")]
    DeniedBySupervisor,
        
    [StringValue("Zaakceptowane")]
    Accepted,
    
    [StringValue("Odrzucone")]
    Denied,
    
    [StringValue("Wymagane uzupełnienie formularza B przez kierownika")]
    FormBRequired,
    
    [StringValue("Formularz B wypełniony oczekiwanie na rejs")]
    FormBFilled,
    
    [StringValue("Zrealizowane")]
    Undertaken,
        
    [StringValue("Rozliczone")]
    Reported,
}