using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class FormsBRepository : Repository<FormB>, IFormsBRepository
{
    public FormsBRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }
}
