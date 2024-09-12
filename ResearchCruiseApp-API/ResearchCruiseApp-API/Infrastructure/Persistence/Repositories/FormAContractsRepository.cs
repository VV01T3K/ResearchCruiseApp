using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormAContractsRepository : Repository<FormAContract>, IFormAContractsRepository
{
    public FormAContractsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}