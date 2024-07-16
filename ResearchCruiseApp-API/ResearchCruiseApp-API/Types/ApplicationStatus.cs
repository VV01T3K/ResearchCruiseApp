using ResearchCruiseApp_API.Tools.Attributes;

namespace ResearchCruiseApp_API.Types;

public enum ApplicationStatus
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