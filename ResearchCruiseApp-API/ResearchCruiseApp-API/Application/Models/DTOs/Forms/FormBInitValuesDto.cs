using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.Models.DTOs.Forms;


public class FormBInitValuesDto
{
    public List<ShipEquipmentDto> ShipEquipments { get; init; } = [];
}