using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class FormsCRepository : Repository<FormC>, IFormsCRepository
{
    public FormsCRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}