using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class FormASpubTasksRepository : Repository<FormASpubTask>, IFormASpubTasksRepository
{
    public FormASpubTasksRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}