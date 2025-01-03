using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class FormBLongResearchEquipmentsRepository
    : Repository<FormBLongResearchEquipment>,
        IFormBLongResearchEquipmentsRepository
{
    public FormBLongResearchEquipmentsRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }
}
