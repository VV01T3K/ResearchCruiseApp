using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormsBRepository : Repository<FormB>, IFormsBRepository
{
    public FormsBRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}