using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class FormCShortResearchEquipmentsRepository
    : Repository<FormCShortResearchEquipment>,
        IFormCShortResearchEquipmentsRepository
{
    public FormCShortResearchEquipmentsRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }
}
