using ResearchCruiseApp.Api.Applications.Contracts;

namespace ResearchCruiseApp.Api.Applications.Contracts;

public class FormBInitValuesDto
{
    public List<ShipEquipmentDto> ShipEquipments { get; init; } = [];
}
