using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class FormBResearchEquipmentsRepository
    : Repository<FormBResearchEquipment>, IFormBResearchEquipmentsRepository
{
    public FormBResearchEquipmentsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}