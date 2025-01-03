using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.Models.DTOs.Forms;

public class FormBInitValuesDto
{
    public List<ShipEquipmentDto> ShipEquipments { get; init; } = [];
}
