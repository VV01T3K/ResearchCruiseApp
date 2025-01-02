using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class FormCUgUnitsRepository : Repository<FormCUgUnit>, IFormCUgUnitsRepository
{
    public FormCUgUnitsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}