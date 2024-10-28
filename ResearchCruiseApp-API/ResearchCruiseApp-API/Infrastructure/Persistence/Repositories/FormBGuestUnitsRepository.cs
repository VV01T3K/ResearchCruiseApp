using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormBGuestUnitsRepository : Repository<FormBGuestUnit>, IFormBGuestUnitsRepository
{
    public FormBGuestUnitsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}