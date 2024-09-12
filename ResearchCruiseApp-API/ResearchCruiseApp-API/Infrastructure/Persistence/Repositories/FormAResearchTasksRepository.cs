using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormAResearchTasksRepository : Repository<FormAResearchTask>, IFormAResearchTasksRepository
{
    public FormAResearchTasksRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}