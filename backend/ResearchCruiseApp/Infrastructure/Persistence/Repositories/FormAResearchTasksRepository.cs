using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class FormAResearchTasksRepository
    : Repository<FormAResearchTask>,
        IFormAResearchTasksRepository
{
    public FormAResearchTasksRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }
}
