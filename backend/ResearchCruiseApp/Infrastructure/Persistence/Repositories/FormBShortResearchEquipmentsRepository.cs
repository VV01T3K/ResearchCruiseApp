using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class FormBShortResearchEquipmentsRepository
    : Repository<FormBShortResearchEquipment>,
        IFormBShortResearchEquipmentsRepository
{
    public FormBShortResearchEquipmentsRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }
}
