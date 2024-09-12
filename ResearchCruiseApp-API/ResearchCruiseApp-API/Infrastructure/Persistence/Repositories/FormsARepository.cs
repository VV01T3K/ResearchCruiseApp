using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormsARepository : Repository<FormA>, IFormsARepository
{
    public FormsARepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}