using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class FormBPortsRepository : Repository<FormBPort>, IFormBPortsRepository
{
    public FormBPortsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}