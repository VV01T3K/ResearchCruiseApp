using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormCResearchEquipmentsRepository : Repository<FormCResearchEquipment>, IFormCResearchEquipmentsRepository
{
    public FormCResearchEquipmentsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}