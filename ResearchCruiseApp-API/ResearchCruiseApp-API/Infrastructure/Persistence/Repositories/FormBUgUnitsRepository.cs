using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormBUgUnitsRepository : Repository<FormBUgUnit>, IFormBUgUnitsRepository
{
    public FormBUgUnitsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}