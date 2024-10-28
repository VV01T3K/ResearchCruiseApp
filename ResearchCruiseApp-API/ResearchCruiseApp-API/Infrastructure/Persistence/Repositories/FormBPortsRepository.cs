using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormBPortsRepository : Repository<FormBPort>, IFormBPortsRepository
{
    public FormBPortsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}