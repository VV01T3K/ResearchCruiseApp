using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormBLongResearchEquipmentsRepository :
    Repository<FormBLongResearchEquipment>, IFormBLongResearchEquipmentsRepository
{
    public  FormBLongResearchEquipmentsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}