using AutoMapper;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Models.DTOs.Forms;

namespace ResearchCruiseApp.Application.Services.Factories.FormBInitValuesDtos;


public class FormBInitValuesDtosFactory(
    IShipEquipmentsRepository shipEquipmentsRepository,
    IMapper mapper)
    : IFormBInitValuesDtosFactory
{
    public async Task<FormBInitValuesDto> Create(CancellationToken cancellationToken)
    {
        var formBInitValuesDto = new FormBInitValuesDto
        {
            ShipEquipments = await GetShipEquipments(cancellationToken)
        };

        return formBInitValuesDto;
    }


    private async Task<List<ShipEquipmentDto>> GetShipEquipments(CancellationToken cancellationToken)
    {
        return (await shipEquipmentsRepository
                .GetAllActive(cancellationToken))
            .Select(mapper.Map<ShipEquipmentDto>)
            .ToList();
    }
}