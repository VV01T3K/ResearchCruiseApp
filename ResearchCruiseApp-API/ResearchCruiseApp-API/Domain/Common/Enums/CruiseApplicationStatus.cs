using ResearchCruiseApp_API.Domain.Common.Attributes;

namespace ResearchCruiseApp_API.Domain.Common.Enums;


public enum CruiseApplicationStatus
{
    [StringValue("Nowe")]
    New,
        
    [StringValue("Zaakceptowane")]
    Accepted,
        
    [StringValue("Zrealizowane")]
    Undertaken,
        
    [StringValue("Rozliczone")]
    Reported
}