using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormCShortResearchEquipmentsRepository
    : Repository<FormCShortResearchEquipment>, IFormCShortResearchEquipmentsRepository
{
    public FormCShortResearchEquipmentsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}