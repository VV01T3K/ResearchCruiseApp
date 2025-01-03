using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class FormCPortsRepository : Repository<FormCPort>, IFormCPortsRepository
{
    public FormCPortsRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }
}
