using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class FormAContractsRepository : Repository<FormAContract>, IFormAContractsRepository
{
    public FormAContractsRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }
}
