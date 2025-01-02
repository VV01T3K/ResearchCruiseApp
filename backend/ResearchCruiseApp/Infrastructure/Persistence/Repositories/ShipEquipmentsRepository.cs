using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class ShipEquipmentsRepository : Repository<ShipEquipment>, IShipEquipmentsRepository
{
    public ShipEquipmentsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }


    public Task<List<ShipEquipment>> GetAllActive(CancellationToken cancellationToken)
    {
        return DbContext.ShipEquipments
            .Where(shipEquipment => shipEquipment.IsActive)
            .ToListAsync(cancellationToken);
    }
}