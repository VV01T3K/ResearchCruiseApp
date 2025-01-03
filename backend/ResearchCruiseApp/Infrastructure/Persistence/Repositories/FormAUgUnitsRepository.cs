using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class FormAUgUnitsRepository : Repository<FormAUgUnit>, IFormAUgUnitsRepository
{
    public FormAUgUnitsRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }
}
