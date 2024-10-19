using ResearchCruiseApp_API.Domain.Common.Attributes;

namespace ResearchCruiseApp_API.Domain.Common.Enums;


public enum ResearchEquipmentAction
{
    [StringValue("put")]
    Put = 0,
    [StringValue("collect")]
    Collect = 1
}