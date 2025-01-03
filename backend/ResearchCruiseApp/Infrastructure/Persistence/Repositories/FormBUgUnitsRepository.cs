using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class FormBUgUnitsRepository : Repository<FormBUgUnit>, IFormBUgUnitsRepository
{
    public FormBUgUnitsRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }
}
