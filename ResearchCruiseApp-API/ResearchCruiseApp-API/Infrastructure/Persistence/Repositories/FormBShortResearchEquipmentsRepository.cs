using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormBShortResearchEquipmentsRepository :
    Repository<FormBShortResearchEquipment>, IFormBShortResearchEquipmentsRepository
{
    public  FormBShortResearchEquipmentsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}