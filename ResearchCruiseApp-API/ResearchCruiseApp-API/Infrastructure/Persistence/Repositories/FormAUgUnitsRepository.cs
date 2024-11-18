using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormAUgUnitsRepository : Repository<FormAUgUnit>, IFormAUgUnitsRepository
{
    public FormAUgUnitsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}