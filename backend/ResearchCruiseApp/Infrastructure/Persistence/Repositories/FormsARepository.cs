using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class FormsARepository : Repository<FormA>, IFormsARepository
{
    public FormsARepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}