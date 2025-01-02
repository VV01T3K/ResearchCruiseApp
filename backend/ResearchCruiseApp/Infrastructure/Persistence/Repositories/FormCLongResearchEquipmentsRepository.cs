using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class FormCLongResearchEquipmentsRepository
    : Repository<FormCLongResearchEquipment>, IFormCLongResearchEquipmentsRepository
{
    public FormCLongResearchEquipmentsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}