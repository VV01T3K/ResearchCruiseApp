using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormsCRepository : Repository<FormC>, IFormsCRepository
{
    public FormsCRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}