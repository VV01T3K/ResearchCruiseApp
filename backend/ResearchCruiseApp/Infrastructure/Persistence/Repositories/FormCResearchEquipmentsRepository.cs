using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class FormCResearchEquipmentsRepository : Repository<FormCResearchEquipment>, IFormCResearchEquipmentsRepository
{
    public FormCResearchEquipmentsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}