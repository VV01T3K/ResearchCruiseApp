using ResearchCruiseApp_API.Domain.Common.Attributes;

namespace ResearchCruiseApp_API.Domain.Common.Enums;


public enum ContractCategory
{
    // TODO: Add the same enum to frontend and remove StringValues
    
    [StringValue("domestic")]
    Domestic = 0,
    
    [StringValue("international")]
    International = 1
}