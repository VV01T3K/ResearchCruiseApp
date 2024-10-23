using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormCLongResearchEquipmentsRepository
    : Repository<FormCLongResearchEquipment>, IFormCLongResearchEquipmentsRepository
{
    public FormCLongResearchEquipmentsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}