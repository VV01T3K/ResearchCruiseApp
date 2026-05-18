using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications.Factories.FormBInitValuesDtos;

internal class FormBInitValuesDtosFactory(ApplicationDbContext dbContext, IMapper mapper)
    : IFormBInitValuesDtosFactory
{
    public async Task<FormBInitValuesDto> Create(CancellationToken cancellationToken)
    {
        var formBInitValuesDto = new FormBInitValuesDto
        {
            ShipEquipments = await GetShipEquipments(cancellationToken),
        };

        return formBInitValuesDto;
    }

    private async Task<List<ShipEquipmentDto>> GetShipEquipments(
        CancellationToken cancellationToken
    )
    {
        return (
            await dbContext
                .ShipEquipments.Where(equipment => equipment.IsActive)
                .ToListAsync(cancellationToken)
        )
            .Select(mapper.Map<ShipEquipmentDto>)
            .ToList();
    }
}
